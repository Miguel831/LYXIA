const { createHash } = require("node:crypto");
const { initializeApp } = require("firebase-admin/app");
const { FieldValue, Timestamp, getFirestore } = require("firebase-admin/firestore");
const { logger } = require("firebase-functions");
const { defineInt, defineSecret, defineString } = require("firebase-functions/params");
const { HttpsError, onCall } = require("firebase-functions/v2/https");
const nodemailer = require("nodemailer");

initializeApp();

const db = getFirestore();
const smtpPassword = defineSecret("ZOHO_SMTP_PASSWORD");
const smtpHost = defineString("ZOHO_SMTP_HOST", { default: "smtp.zoho.eu" });
const smtpPort = defineInt("ZOHO_SMTP_PORT", { default: 465 });

const SENDER_EMAIL = "contacto@lyxia.es";
const OWNER_EMAIL = "miguelpp2003@gmail.com";
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 4;

const interestLabels = {
  automation: "Automatización inteligente",
  data: "Datos y analítica",
  ai: "Inteligencia artificial",
  custom: "Solución a medida",
};

let mailTransport;

function getMailTransport() {
  if (!mailTransport) {
    const port = smtpPort.value();
    mailTransport = nodemailer.createTransport({
      host: smtpHost.value(),
      port,
      secure: port === 465,
      auth: {
        user: SENDER_EMAIL,
        pass: smtpPassword.value(),
      },
      disableFileAccess: true,
      disableUrlAccess: true,
    });
  }

  return mailTransport;
}

function readText(value, field, maxLength, { optional = false, multiline = false } = {}) {
  if (typeof value !== "string") {
    if (optional && (value === undefined || value === null)) return "";
    throw new HttpsError("invalid-argument", `El campo ${field} no es válido.`);
  }

  const normalized = multiline
    ? value.replace(/\r\n?/g, "\n").trim()
    : value.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim();

  if (!optional && !normalized) {
    throw new HttpsError("invalid-argument", `El campo ${field} es obligatorio.`);
  }

  if (normalized.length > maxLength) {
    throw new HttpsError("invalid-argument", `El campo ${field} es demasiado largo.`);
  }

  return normalized;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function textToHtml(value) {
  return escapeHtml(value).replaceAll("\n", "<br>");
}

function normalizeSubmission(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new HttpsError("invalid-argument", "Los datos del formulario no son válidos.");
  }

  const requestId = readText(data.requestId, "identificador", 36);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) {
    throw new HttpsError("invalid-argument", "El identificador de la solicitud no es válido.");
  }

  const email = readText(data.email, "email", 254).toLowerCase();
  if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i.test(email)) {
    throw new HttpsError("invalid-argument", "Introduce una dirección de correo válida.");
  }

  const interest = readText(data.interest, "área de interés", 32);
  if (!Object.hasOwn(interestLabels, interest)) {
    throw new HttpsError("invalid-argument", "Selecciona un área de interés válida.");
  }

  return {
    requestId,
    name: readText(data.name, "nombre", 100),
    email,
    company: readText(data.company, "empresa", 150, { optional: true }),
    interest,
    interestLabel: interestLabels[interest],
    message: readText(data.message, "mensaje", 3000, { multiline: true }),
  };
}

function getRequesterKey(request) {
  const forwarded = request.rawRequest.headers["x-forwarded-for"];
  const rawIp = Array.isArray(forwarded)
    ? forwarded[0]
    : forwarded?.split(",")[0] || request.rawRequest.ip || "unknown";

  return createHash("sha256").update(rawIp.trim()).digest("hex");
}

function submissionFingerprint(submission) {
  return createHash("sha256")
    .update(JSON.stringify({
      name: submission.name,
      email: submission.email,
      company: submission.company,
      interest: submission.interest,
      message: submission.message,
    }))
    .digest("hex");
}

function emailFrame(content) {
  return `
    <div style="margin:0;padding:32px 16px;background:#0b0a0f;font-family:Arial,sans-serif;color:#eeeaf4">
      <div style="max-width:620px;margin:0 auto;padding:34px;border:1px solid #2c2738;border-radius:18px;background:#15121d">
        <div style="margin-bottom:28px;color:#b99cff;font-size:13px;font-weight:700;letter-spacing:3px">LYXIA</div>
        ${content}
        <div style="margin-top:32px;padding-top:20px;border-top:1px solid #2c2738;color:#817a8e;font-size:12px;line-height:1.6">
          LYXIA · Soluciones digitales e inteligencia artificial<br>
          <a href="https://lyxia.es" style="color:#b99cff">lyxia.es</a>
        </div>
      </div>
    </div>`;
}

function buildOwnerEmail(submission, receivedAt) {
  const company = submission.company || "No indicada";
  return {
    from: `LYXIA <${SENDER_EMAIL}>`,
    to: OWNER_EMAIL,
    replyTo: { name: submission.name, address: submission.email },
    subject: `Nueva solicitud de ${submission.name} · ${submission.interestLabel}`,
    messageId: `<${submission.requestId}-owner@lyxia.es>`,
    text: [
      "Nueva solicitud desde lyxia.es",
      "",
      `Nombre: ${submission.name}`,
      `Email: ${submission.email}`,
      `Empresa: ${company}`,
      `Área: ${submission.interestLabel}`,
      `Fecha: ${receivedAt}`,
      "",
      "Mensaje:",
      submission.message,
    ].join("\n"),
    html: emailFrame(`
      <h1 style="margin:0 0 24px;font-size:26px">Nueva solicitud de contacto</h1>
      <table role="presentation" style="width:100%;border-collapse:collapse;color:#d8d2e1;font-size:14px;line-height:1.7">
        <tr><td style="width:120px;color:#817a8e">Nombre</td><td>${escapeHtml(submission.name)}</td></tr>
        <tr><td style="color:#817a8e">Email</td><td><a href="mailto:${escapeHtml(submission.email)}" style="color:#b99cff">${escapeHtml(submission.email)}</a></td></tr>
        <tr><td style="color:#817a8e">Empresa</td><td>${escapeHtml(company)}</td></tr>
        <tr><td style="color:#817a8e">Área</td><td>${escapeHtml(submission.interestLabel)}</td></tr>
        <tr><td style="color:#817a8e">Fecha</td><td>${escapeHtml(receivedAt)}</td></tr>
      </table>
      <div style="margin-top:24px;padding:20px;border-left:3px solid #a487ff;background:#0e0c13;color:#eeeaf4;font-size:14px;line-height:1.7">
        ${textToHtml(submission.message)}
      </div>`),
  };
}

function buildClientEmail(submission) {
  const companyLine = submission.company ? `Empresa: ${submission.company}\n` : "";
  return {
    from: `LYXIA <${SENDER_EMAIL}>`,
    to: { name: submission.name, address: submission.email },
    replyTo: SENDER_EMAIL,
    subject: "Hemos recibido tu solicitud | LYXIA",
    messageId: `<${submission.requestId}-client@lyxia.es>`,
    text: [
      `Hola ${submission.name},`,
      "",
      "Gracias por contactar con LYXIA. Hemos recibido tu solicitud correctamente y la revisaremos para responderte de forma personalizada.",
      "",
      "Resumen:",
      companyLine + `Área de interés: ${submission.interestLabel}`,
      submission.message,
      "",
      "Puedes responder directamente a este correo si quieres añadir algún detalle.",
      "",
      "El equipo de LYXIA",
    ].join("\n"),
    html: emailFrame(`
      <h1 style="margin:0 0 18px;font-size:28px">Gracias, ${escapeHtml(submission.name)}.</h1>
      <p style="margin:0;color:#c8c2d1;font-size:15px;line-height:1.75">
        Hemos recibido tu solicitud correctamente. La revisaremos y te responderemos de forma personalizada lo antes posible.
      </p>
      <div style="margin-top:26px;padding:22px;border:1px solid #302a3d;border-radius:12px;background:#0e0c13">
        <div style="margin-bottom:12px;color:#9b83db;font-size:11px;font-weight:700;letter-spacing:1.5px">RESUMEN DE TU SOLICITUD</div>
        ${submission.company ? `<p style="margin:5px 0;color:#d8d2e1;font-size:14px"><strong>Empresa:</strong> ${escapeHtml(submission.company)}</p>` : ""}
        <p style="margin:5px 0;color:#d8d2e1;font-size:14px"><strong>Área:</strong> ${escapeHtml(submission.interestLabel)}</p>
        <p style="margin:16px 0 0;color:#aaa3b5;font-size:14px;line-height:1.7">${textToHtml(submission.message)}</p>
      </div>
      <p style="margin:24px 0 0;color:#aaa3b5;font-size:13px;line-height:1.7">
        Si quieres añadir algún detalle, puedes responder directamente a este correo.
      </p>`),
  };
}

exports.submitContactRequest = onCall(
  {
    region: "europe-west1",
    timeoutSeconds: 30,
    memory: "256MiB",
    maxInstances: 3,
    secrets: [smtpPassword],
    cors: [
      "https://lyxia.es",
      "https://www.lyxia.es",
      "https://lyxia-b752e.web.app",
      "https://lyxia-b752e.firebaseapp.com",
      /^http:\/\/localhost:\d+$/,
    ],
  },
  async (request) => {
    const rawData = request.data;

    // Campo trampa: los usuarios reales no lo ven, pero muchos bots lo completan.
    if (rawData && typeof rawData.website === "string" && rawData.website.trim()) {
      return { ok: true };
    }

    const submission = normalizeSubmission(rawData);
    const fingerprint = submissionFingerprint(submission);
    const requesterKey = getRequesterKey(request);
    const contactRef = db.collection("contactRequests").doc(submission.requestId);
    const rateRef = db.collection("contactRateLimits").doc(requesterKey);
    const now = Date.now();

    const delivery = await db.runTransaction(async (transaction) => {
      const existingSnapshot = await transaction.get(contactRef);

      if (existingSnapshot.exists) {
        const existing = existingSnapshot.data();
        if (existing.fingerprint !== fingerprint) {
          throw new HttpsError("already-exists", "Esta solicitud ya existe con otros datos.");
        }

        if (existing.status === "complete") {
          return { complete: true, ownerSent: true, clientSent: true };
        }

        const lastAttempt = existing.lastAttemptAt?.toMillis?.() || 0;
        if (existing.status === "sending" && now - lastAttempt < 90_000) {
          throw new HttpsError("aborted", "La solicitud ya se está procesando.");
        }

        transaction.update(contactRef, {
          status: "sending",
          lastAttemptAt: Timestamp.fromMillis(now),
          updatedAt: FieldValue.serverTimestamp(),
        });

        return {
          complete: false,
          ownerSent: existing.delivery?.owner?.status === "sent",
          clientSent: existing.delivery?.client?.status === "sent",
        };
      }

      const rateSnapshot = await transaction.get(rateRef);
      const rateData = rateSnapshot.data();
      const windowStartedAt = rateData?.windowStartedAt?.toMillis?.() || 0;
      const insideWindow = now - windowStartedAt < RATE_LIMIT_WINDOW_MS;
      const requestCount = insideWindow ? (rateData?.requestCount || 0) : 0;

      if (requestCount >= RATE_LIMIT_MAX_REQUESTS) {
        throw new HttpsError(
          "resource-exhausted",
          "Has enviado varias solicitudes. Espera unos minutos antes de volver a intentarlo.",
        );
      }

      transaction.set(rateRef, {
        requestCount: requestCount + 1,
        windowStartedAt: insideWindow
          ? rateData.windowStartedAt
          : Timestamp.fromMillis(now),
        updatedAt: FieldValue.serverTimestamp(),
      });

      transaction.create(contactRef, {
        name: submission.name,
        email: submission.email,
        company: submission.company || null,
        interest: submission.interest,
        interestLabel: submission.interestLabel,
        message: submission.message,
        fingerprint,
        status: "sending",
        delivery: {
          owner: { status: "pending" },
          client: { status: "pending" },
        },
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        lastAttemptAt: Timestamp.fromMillis(now),
      });

      return { complete: false, ownerSent: false, clientSent: false };
    });

    if (delivery.complete) return { ok: true };

    const receivedAt = new Intl.DateTimeFormat("es-ES", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "Europe/Madrid",
    }).format(new Date(now));
    const transporter = getMailTransport();
    const failures = [];

    if (!delivery.ownerSent) {
      try {
        const result = await transporter.sendMail(buildOwnerEmail(submission, receivedAt));
        await contactRef.update({
          "delivery.owner": { status: "sent", messageId: result.messageId },
          updatedAt: FieldValue.serverTimestamp(),
        });
        delivery.ownerSent = true;
      } catch (error) {
        logger.error("No se pudo enviar la notificación interna", { requestId: submission.requestId, error });
        failures.push("owner");
        await contactRef.update({
          "delivery.owner": { status: "error" },
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    }

    if (!delivery.clientSent) {
      try {
        const result = await transporter.sendMail(buildClientEmail(submission));
        await contactRef.update({
          "delivery.client": { status: "sent", messageId: result.messageId },
          updatedAt: FieldValue.serverTimestamp(),
        });
        delivery.clientSent = true;
      } catch (error) {
        logger.error("No se pudo enviar la confirmación al cliente", { requestId: submission.requestId, error });
        failures.push("client");
        await contactRef.update({
          "delivery.client": { status: "error" },
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    }

    if (failures.length) {
      await contactRef.update({
        status: "error",
        updatedAt: FieldValue.serverTimestamp(),
      });
      throw new HttpsError(
        "internal",
        "No hemos podido completar el envío. Inténtalo de nuevo en unos instantes.",
      );
    }

    await contactRef.update({
      status: "complete",
      completedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return { ok: true };
  },
);
