import { useEffect, useRef, useState, useMemo, type CSSProperties, type FormEvent } from "react";
import { httpsCallable } from "firebase/functions";
import logoIcono from "../assets/logo_icono_lila.png";
import logoVertical from "../assets/logo_vertical_lila_blanco.png";
import visionImage from "../assets/imagen_quines_somos.png";
import { firebaseFunctions } from "./firebase";

type NeuralPoint = {
  x: number; y: number; z: number;
  globeX: number; globeY: number; globeZ: number; land: boolean;
  scatterX: number; scatterY: number; scatterZ: number;
  tunnelX: number; tunnelY: number; tunnelZ: number;
  size: number; color: string; phase: number; outline: boolean; rim: boolean;
  layer: "cortex" | "ridge" | "rim" | "cerebellum" | "stem" | "ambient";
  relief: number;
};
type Synapse = { x: number; y: number; z: number; radius: number; phase: number; color: string };
type ParticleBatch = { path: Path2D; color: string; alpha: number };
type ReferenceSample = { x: number; y: number; density: number; signal: number; pigment: number; edge: boolean; light: number };
type ReferenceBlueprint = { samples: ReferenceSample[] };
const TAU = Math.PI * 2;
const COLORS = ["#b78aff", "#f6c44c", "#75dfbd", "#fcf8ff", "#8150ee"];
const BRAIN_REFERENCE_WIDTH = 88;
const BRAIN_REFERENCE_HEIGHT = 72;
// Individual symbol positions, luminance and pigments sampled from the supplied brain.
// No bitmap is ever painted: these records only define the animated particle geometry.
const BRAIN_PARTICLE_BLUEPRINT =
  "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" +
  "wmhIzmmZUHO5L3K9nlVbrRSUaO/alDiEKpu4/2Z8oL0JpVj3Ioo4pVovyP+d13rv8236/2+neda8bkA69YZ6/3vLYZzXuvr/04EgMcCnKHvhl2Lv" +
  "A7iq/xalof8Ss1HWlg9o/6Pqav8NWnjm34Mie3MJauY712rvM5swnLfy+v9H4ULve+8yrUjcwv9W4er/ZS/I/4CBOWvp2vr/KUlSzsIxKsWOUWi1" +
  "IEVrzmBYUISjWrr/pI0wlNfr+f9S5vr/edWA/2clauZtYSN77Mm6/zGKOKUWTPj/WIFw3qXCKMXQuuL/uesy1hyKaObjcKD/xKIwrc5Cgr25RXLF" +
  "KIF4/1rLYr34gfj/Vur6/3cHEoQvMZn/iBS4/z9M+v/rYXL/ur0qlPSg6v83unHF842A/07h6v+t15LvneP6/8pKgtZIF0H/0LNi/+G/mO8SX/r/" +
  "UNDq/zHhQJRv7XL/oS2S/2hKMEIrL/n/1S9a/w22yf+xkmjWuZ1QhN9pmP83mWuldRJqzroXsv950mm90zSy3uVyeP9YHMr/vDl6/0PT+v++xmK9" +
  "EJv4/0WKMIyjWHK1kJ5Dc+nX6v8tLfn/LaUxjNcxoq3h6vr/lqpocxKW+P9O1aL/a+PK/3Pm+v/npfj/jIh6xSC1eP/EZIDmq8KSrcS6Ot5jxjGl" +
  "RVMwnN1+QHvGyfr/jLFIOsDV+v+66FDOVOH6/7brYtY/sZC9XlowjMxzaIzb47j/IpvR/9lH+v/Os8L/kL8gc05VoP+7uiKl8pJS75wXQL3GQqr/" +
  "8Xya/xDS+v/X4dH/Ep3Y/xxfOObChYC9n2ISlM8xsv+U2ILO8nL6/0xMMYy4ZnilQjYqa1iKKFJzlkiMRFhRvW3LSpzA18r/eEkoa1anQJzbnmC1" +
  "gpSBvTuSKK3Z4cn/P2h4/9fv0P8pO5Lmityi/70mMM4ipUjFTDGy/we4+P936vL/qdz6/7POUv83g4j/Esb6/4AeqP+l64r/wn4oc9TVMK1gy2q9" +
  "daAYpfaB+P/qTzpzUiz6/ybOQKVM09r/Uir6/1jvGnNQYmi1Xq6SxQWu+P+hIzi93VP4/+6gSP+Y5vr/Fl36/ztRmuZHVlnewN9Q1spfQ6VgGeLm" +
  "5W7ApYiuGCl+8lKUwM5y/zs4Mr3p3vr/Im5gtdJM0f+dFbD/1+35/+WZuv9H0vn/sb8qpa15KGtgXaDFEnmy/2J1KDp73pr/RbFLlMraeP9lEPr/" +
  "JJng/5Le+v8Qmfj/Jpn4//inYr22wqKlow/L/+vSwP81tnDeXtNa77oVMlptNIj/HpxovaHEyv+vfLicwH6AxWlKYGu2wCKlP6B7/xKN+P/Sr7L/" +
  "ghWAzgl6+v9r1VnO55L6/+Gngf/AQFreUOPq/zWjeJzQzvr/wu1KrRpOyv+brCild6QYMRJ30v8kwqr/9Kfi/z1poP91Gbj/hMYxc9+9SM7Ur9r/" +
  "pxe4/2eXkL1txjJrHnno/+GUev+pvUi1TIGY7zGNOKV3OzjFGLM5rU6ekHO0yYrOsak4a3kZkP8HZoDOra+I78ToiP8Dovj/L1UoY04x6v8iR4L/" +
  "xJlQ5uqseq0/dZDmQ8uo/8CKqPftxML/O3o4xauQaHvMzvr/iByw7zktuv+vr0ClVtWi1mW4SoRWwjK1mEAopZk7Qc7leWjFnQn4/zWlYMUvcJD3" +
  "IKrQ763j+v+vmFJzKVA5pUqgKXOIxEtawEJS3u+pSv+f4/r/zqIgnF6syv+UrFD3456C/yuKkP8DxpDWbckia8KWsP+IZimEnwv4/7XX+v8Dpfj/" +
  "1Ezx/2C5Wns5OGLmi4EqShBm+v/UfCghvTFKrcI5iNbAL2itOdB63rzLev/UQnr/xidq3qu2wN74g/r/YBX6/8ZpaN7yyUitRV+Z76Avcv/QqEDW" +
  "zoNQxSiZ4P/yp5r/NdPA/+VpWK3AO5r3MdNY1spWiffygVK9lNBKrUQjUK0/p4j/tO3K/xyiOJxQQEnv14cgUkZfec6BC+j/YkdLWjOG4P87xIHm" +
  "C7PA/0xywP+ayyqUmtVK95wt4v/puEDeczaQ/3Meuv8w2mrFreH6/zOBkP9l7fr/SqIpcw2F+P+8X4C9VoE4raO9MN7Kttr/Jr+4zhpF8f/NmziM" +
  "lFg5a1gsyf9U11LWA4jw/4Tm+v+1SlKlu1M6nK+N2Pc3TCqE87Wi5sCgkP8xMVr/oEWq/7izUXMc2RhSZn4wlHXSYZShaSlaTkAx713aguZIryGt" +
  "NzGy/28vyP/Ux+H/1cua/+fm0v/R2DiEKHzg/2BfgMUmR7L/FLp41kpCoc4exEnma3V4cwez+P9MsVmcrYgwhOHLOJyZWiFzIDv5/0o2ks637WLW" +
  "Eojy/93r+v+tLXC90r/6/2d+KJQrmYj/sdVi/2fo+v85xGm9gpI5vVzOaubxcNr/Gnea/xa2WPdWHPr/pSVg7yKeuf8/fpD/kgv4/3N3caW8zsr/" +
  "Xub6/4bcyv9tKqHmILig/+NMyv9rDfr/sdz6/yk9kvcnOIn/juH6/7ff+v/tlKj/STSi//BYWCnWVZje0ML6/6uIaITd3FH/adpS5nmZQLXRopCU" +
  "juiS/zd3QKVIboCUpe36/7OUkNYnZojm/o0ac7qIIGOMHmjmNYWA/+rcqnvEfJDvPNxie6fEMpTblFCEYKV41nF3KaV3HLD/GGvA/xBk+v8cQvD/" +
  "D6J5/8Acwv/O3nCtXO9KrV7O2v8eQsP/caBYY5qiqJyaySrWaTE4/58QwP/VSfr/nzua/061arW2FcLmRc74/2Paqu8eTLr/Whf6/6fauv+4wjKl" +
  "xipy3iox6f/CdEBzmuH6/w3L2f9O0OL/rcmaxWBKK1oQ0Pn/Hs6q5u5Y2tbKwur/pb2o/53VWu81bjCcR976/5YaUv85JaH/JmHg1g56ov8Dlvn/" +
  "mhCw/+OPYu9pJXj/iqM7awGR+f8xzoLvHtV4/0c7KrWnwTjFLmeYxeNKcuZYNEit42dAhOG9UM6W10rOWnyYxaktatbbs4L/6lGqc29HgN7C2kjm" +
  "sTJBtWMsWf/tgVDWuh5o7w3Cyv+gs6DmXNia/1aeKJRWTCi95ctwztc9+v93qCNzccuKnCSFsP+I9CI6jKxgpWcqmf8is8j/M21AxRJ8sv93DYr/" +
  "K2aYxWPcouYDwbj//IQQQu1f+P/CWKHOmFhbzuV8UMU5g0D/peai/6sgQZSz1/r/JjT5/5JtKbXANEKlm0Wo70MeU+8t3+H/KcTK/ySSMpwWujjW" +
  "+Hmw/7rX+v8SWFLmmOo6lIQZUP9mI4L/2Hw4e0NTMJxegGi1A4bw/1ZYaL0UmdD/zMf6/w+F+v/ld2DOXlMphNs7cvdl06r/Z8Ype3sGOox1C/r/" +
  "tS9ita3e+v8p3KH/vtX6/6BbUv+nvdj/WCWS/3dLQDpQqkprfjbg/8LJev9AsVClq+P6/6uxeO8HaYj/nz1y/0ycaHseyWnmdWQxa9dVkP+jscDm" +
  "gNxS/0Fhsf8StsD/WBSq/ybLgK2YvyutnlBg3qPGwsWICYj/FqxB1tlO+P8Ncvr/xMJCxRKnmf93MWj/Inyg9yCscb3KlChjXn9wtcxYab1WNJD/" +
  "oeja/zvCof+XsTiEve1yrUwVULWcENj/uloqa2/hcv85lECMyL1q9xaN6P/IKLr/jCUwjBx60v9Bj5jvJMT6/zWKOJRCZ1GlpcsqhOFTiv8ofnj/" +
  "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" +
  "Abio/zlaWpyf37L/SnBozm8Xmv+U1TrO572q/4bo+v+cXzmMuu1yxemRuv9nrCKcYVUghNN3YIyQ2OL/vkw6vV+sgpTQO1Lv4X4ghGHt+v/YX3jm" +
  "Ncty1lYxov+8KlicyE74/+tkSP9GTDqMcZcojG8taOZr7cr/4+b6/yJTaM5f36LWa3cgUnMXkv9MpSiUFk76/7IScrVeZEOcBb+Q/75+SIzVtvr/" +
  "xO16rZ9/OBlBtkucetzC/+WxYvdaI7r/edp6/0NYmb3vX/r/lDZ4rVS1Yv8Jsfj/1LH6/1ZCkObUpznO2eZA/8RdcL0t0lG9jNqS/4E+YLW0I6je" +
  "byib/xxYSNbOlGitTMRi/+d3cM5WL8r/vioonNZ0SIQmhqD/8bHq/2Xo+v/Q2FCMWr0ypbGIaIzEO5n/12k4hA+nSP89v6HFL8mi/xxkqP9cVlOt" +
  "9qnivSaWUP9U66r/CYb4/xp54v+xHFjOWmFojMZAUv8ccvr/25ZordHE+v8Ha/D/gKBLc7nhgP9e4/r/lMQqjJZoIUp+p1CcFGb6/ye9WM5WGfr/" +
  "YS+D98DS+v+lY1o6N+Eiaw5k+v97QDCU524wpT2SgP/ONKr/O484lOqgqN6tdTtr19Ko/8JfmL0oTlicTlMotcJTQsXdSbL/sKdwaz2gi/8eTtj/" +
  "DdKA/xqUaKXSttL/Gl9o5uHGMK1z6Pr/rdWa7zuZc6WhPer/o9d61tthuP9UlpicVBSa//Sl0v/d4cD/KzHR/3UJkv+l6Hr/PXUo5sa9cv95lENr" +
  "JjFQ/2vh2v/T6JHmzCjS//KbWOYitrj/ezkwvaNjalpYutr/ZOOq/+nO+v+1xGq9yKIopVjMkv9YpSNzqxw4/8SpKMV1LbD/Ko9Azk44MNaC4/r/" +
  "lhJixVDX8v8Bv9j/jtCQ1mAjuv+c6Pr/RUmC71TVctZSpUilCWSa/0fHuv9SUyic6aWS/2Bkc5xzJZj/te/6/2cS+v9BvVmlSpKQ99TEcv+E5Pr/" +
  "KLoqlO93ct4Ptsj/FF/6/5wUiObps5L3TOgyvdlYwP++aWB7c65QjDXQU62p4/r/vjtaxbrJot5eDSpjYOaq/5InUJzla1Cl27aJ/wmPmf+p6nr3" +
  "YoUwYyp6SPc5ulnFNTTK/50qU7VSTIDvQxz5/3WUOEqz62L/11yI5r7joP/nXGKcYCDC/+vV6P9WrrLenrpI/9cvIq15sRg6MUpCe6lHIGtIGXH/" +
  "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" +
  "scSSxVrrwv/n6HL/jjZI3lgq4v+rDaKlhhTY/4Y0GGOrFKnms0kyjBTE2P+ZoDicTklo5nt6Yr2K4fr/AZ7g/yqNWPdWEEu986Cw/yZruP9i6Pr/" +
  "O6fg/8JHkv9ORGjeq+H6/9U74v/GZjjewDEwrYgN2P9xXThzToNIznMUYv8cZpD/p9fK/ySqMIyS6KL/9pGy/xC7sP9vQiitEbho/6NJ0v+Q01LW" +
  "53LQ/8LCgsV3mXi16echaxKZ2P+xhoBzbdAypbUeOKU7KFnWKn7Q/yB8oPdFbnjvDWH6/99Yev9pqRt7malIhGno+v/prHL/KbF4hDmWwPdeQpjm" +
  "myFAvdDSMpSdU0uUUhea/35oIWthUSlSozE6vbepO6WnuJDFCcTw/8KxUZTG10jFTNX6/7MhgN7IUMD/Ly/Z/8jCgv+QUZi1jMcZjDttYObXsXj/" +
  "Q8eq/6l7YNaUPYjepTb6zt1a+P/ESqL/lEmYc7KGQHPKKPr/wrhizmXhwv/M0rL/EnDY/wOxwP+YpUilKmeYzhKK+P9SWii9Rs66/9fLUc7ZYpD/" +
  "18L6/yI5+f98HJjWxIio75thac5MrzmcPbhTa/ig6v+jUXLWFGn4/4kGO5Tb7fn/pcRilB6luP8Ug2j3myNgvVhVKYRmCFqt4arp/8xpKFJMoziE" +
  "bJ0wpWZRMDoaszClyC96/4zJUYyYy5LW49ya/xSvyP8m14PWkhDI/9Lt6P83v1HeE1p6/y15gP9B12r/dcRKY23j+v8gyUDFPbFQvcpO0P8gm7H/" +
  "ObOIztmbIGscRLn/3+v6/yBOoc6tF9H/K846tVIxiv8/pZP/Ccv5/yxpmP89Hvn/kNr6/3Xm+v95IJD/tRtw736PWZwkuDDOsxl4zn3cYv8YlDi1" +
  "FtBj/w1w+v+CCYj/ht/y/wt++v+61fr/gu2q/37asv8Fm/j/vo0wzilpoP/bMjJKbWtIWhp+wP8zKvn/kI+CxdJ+yO+7PULFWiFa/1jo+v8UYfr/" +
  "5dpa/1o7SMXdmSjF6Y2a/8jcsO8/wjnFScTK/91d+P/bVej/JrWQpYCLOXvvxPr/FlX6/zd1gO9Kzqr/39yx/8+2ev9hp4DWzDFq/8Zag84z3orv" +
  "f6IzlKW2kMWSoCuMZ9OC/4To+v9rLbH/rS+i/yeFsP/GJeL/r9r6/y2bwP8Plmj/w2Zg5jlmSa0agfj/SsSy/5g5gO953+L/8cvg5n0Iyv+6ZnCM" +
  "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" +
  "cz2gxUPO2P+SMTm9oUDC/zlMMoTU02j/xJaY/987koTns4LOVr9KtWcLiv9BKjmchgv4/1Ivmv+vi3D3bV+C3t3VUM6hsZje72H6/xVYyv/lXFKc" +
  "pdzi/92nQdbphTDObxzi/7VFIoylurj/dTSIxe/JoP+xwoqleyWI3i/Hqv/wrsr/OdNg/9tM+v8HrPD/Zzh491xFS7UJoID/r+P6/6l4SIQtxDq1" +
  "IL14/3Ho+v+pkZiUA5n4/3M4eP/E6lqtSUW5/2DXQsVKiji1zOGI/w11+v+dqeD/R8Ti/7cXiv9pXCpaLzly931+IjHfilKcFlj6/7yNwM6fFEDW" +
  "nDtpzmINuu+XzpK12fExSsrOkv8v3DG9MTSS/xpVQNZUvUKtMTs6rS+PwP8LyXj/EcLa/z+7YZQgecD3ztPKlGcQ+v9p3GrmC6JQ/+220v8vhkjF" +
  "nzTa3k7m+v+a0GLmjCB4vQ9fyv/VaWi93Tvy/yKqgO+vuliluUJCjHuDKSFU0/r/THtj1lIhyv/pnvr/7X44vbXhyv8/bZD/mNVq/75Tsv++HoH/" +
  "cSiQ98RvSJyr5tL/zFVRvczL+v+ynnjFtSo4rdnOuPcWa9j/iuoynChAWsXCmTjmc9yZ/3XtSv/pqsD/K3VCpV7HiP/SgEhrPzRy73tDcJRr0FKl" +
  "nK64/0NHeu8Jg/j/Nyi5/5naev+tHHD/KJSw/6cqedajTKr/xNDS/wd1iPd1y2DOp+1a/z8vSt5vMVD/IqIwzq2iIJS4kkil59ea/6W4mMUx3Hrv" +
  "EHf6/5zYovd1MXjeiqVTezdpKJQkfvD/iuja/0QoQHt8dTEh3ZRZrVB8QOZSPUutMdWS5umU+v8/Tnq9zo84Y5Dm+v/vcFD/YKIojAzE+v+CBjic" +
  "tfL6/5weSK1tC9L/qbGoxTPOcu/4m/r/vJZgvZClWHPU7fn/cdxh/wugwP/Vwvr/oSia97z2Gkq5ZGClp976/0R++P8vjUi99HD6/6drQmuOxCiE" +
  "0K9S9wuI+v8Dunr/0uGg/4Lm+v/0a/j/ViyC/2sv2PepdSNaiNqJ/9s26v9p7br/XDSR7xR3wv89zmre1bH6/9lAgv8/X5HmuIogaxSpefeSumDW" +
  "DHf5/xZT+v9W5vr/s5HI1gd86v9iOVmc767C/0y4MpT2sypj01hQ3viIov8DlOH/wI/A/91V+P+xpRg6HH7Y/9W/qv+OGUjFzF04aynjUEqMqmBz" +
  "GH74/+2gaN5Qa6D/io+y79lW+P8kZrH/zijK/+ei+v8WWvr/3axx98pM+v9jwoDFGMRL5nNCkLW4USp71FGh/984YkISwtD/+oNi7wWx+P+9qnC9" +
  "3VHg/4YeUMUQpVHvzrGi92KsOpQJwXD/MEUqY6UUi+Zt7XL/utDi/7f0ev9U2tL/Kq8ohISZILWCITilJqwopbVOIns3XyickqVolJgL+P9euFrO" +
  "lBxi/5JUOHsv4DiMjiV4zgu/6P9v11nO31GS/7fO0v/Kyfr/EmT6/1zt2v+z2vr/YMlKpQvCwP9gqVDW51WK/wfGuf+NiFI6eTpgxVLo+v8qhvD/" +
  "xk76/z9AInMUpdH/Ijvx/4TQoebp03r/r78qjAdiMJzGO6nvTuP6/xpKwf9QKqreO4GA/4baWd7rfoC91NdQrcQemv81JZn/UDSi/xpyuv+l1TL/" +
  "RHzg/8bHwv+HOUha9IO6/0yDcLXyYYr/Wh5q/8bEUveOUhCU37Ng/+GIOoxBxLH/TnJ5e4QciP9lenC9X39pjJ3civ+Gy4neFoHA/1wemv9UL/r/" +
  "wiNy/6fc+v+h02LWudX6/7mZIJSW4fL/Trhatd9rOLXPhmjFuu/C/8xOe/+prHDOwPMSnA/Q0f9aMZD/ysvC/8Ajev/lj7r/C2b6/3oqcM78iDJS" +
  "kr1QvRKb+P/fcEjOnxm4nLuFUN5c1bL/49Bgtfqdot4aa/j/zD1AtaMViP+QHDDFcT0oxeW/WebnU2LeSmTA1ndjaCEMmZD/KjS5/5IXOr3yuoje" +
  "EIPy/4Thyv/Xo0hKbHo4xQvG4P8gQoH/kxJyxYjh+v/vsaL/7cf6/0zO0v8kQHDFQdWy/yI9if+dSVneey+Q72Tt6v8ctli1C236/ySlMIwgZJj/" +
  "WN/i/0GvYKWMtVBz18Ty/xZ5+v/WQur/+Iqq/6WqQFoxUyFaUmKoveVY0v+ZXyGMVuP6/9ubIGsQksj/THSA/7zayN4eO4D/zlwwcxR+6P8a1Zjm" +
  "D3L4/7h+SKWSr1DefxAzrWA5UZzG2oj3ZSVS5pDoav9BVknOq8lqxWFcYMWrk2iEbTnA5i3QgrWMEqj/wPKCnLy6UnOx4/r/HMJY/4wXeObGiliM" +
  "xJ1wxRazQdYgVYjWbV1a3tvOoPc7oEvvdSOI/30GirXCqSjFiJmgrVDa0v/f10jvlDK5/4qnO0JBPSpztcKSxVIZkv8Nsajv543i/5Lm+v+r3Or/" +
  "pUK6zueW6v83OFrm5Vqa/7XTev/GR2rvmwv4/+eBeuYrfKD/2dPo3mXLWq1IXzHm27GS/+eP+v9v0DGMjJSatR6NMKXrrjKloxxge1CUmO+dQjLW" +
  "vFhajLY2UqXfZJjOfej6/8CS4PeFySlz3bFB3qMhOJTVydH/dQ3C/y2IYP8FwrD/Sr3K/zmuKHPUnDBS38ZorUjO4v/Ouqr/Nypx/8Q9iuaf4fr/" +
  "d+P6/8ByuNZ9M0CUaaJ53m0cav+fy8rF1I0oUvGgeP9SFPj/kMYohAVrcKUkllDe35Jq/298OHMLj7n/K8RitRTV8P8zKLn/Dsb6/1KsMoyx69r/" +
  "Ksb6/7zV+v9BTOr/uRxg3poxuv+hJkC9Jtz5/8KzUoTh4fr/0+ZY5h6qqP/px4r/PY1AxcDQ+v8NfPj/ax6S9zGPOKUthbj/Fn6w/3ES+v9SEtD/" +
  "EayB90ZriN5Wa2DO4VGC/57H0v+tjxh7MtBq7wepwP9KQCnOKcKCxRax0P+3IIDmCW36/+eb+v9/1Urezuu5/2IeUu9mDZL/vtDi/+F5EGvjv4C9" +
  "Caf4/9+PMrUkzjnFkrGw3h6skf+a4/r/yOiI776eInPfrOH/sT0iYySD0P87ijCtZBL6/+Xj8v8SfqL/lAZgvdl8WGtWR5jW9LpxnFLc+v9suDLW" +
  "qRDJ/1BYeP8VSlnmQV+ZxQd58v81KJn/XDZRjIwyO3t77Xr/WsLS/1Ieev+6Gfr/kAaoxY4XUO91HPj/C2v6/xKqyf+ZWEuUb9JJnFLJ+v+A2tr/" +
  "IIP4/xC/yv8ahpj/WpYopYy9cHtcqiic9nfg9yRJuv8ocEDFA5L5/8TLmv8jWkCMnQ34/3MskP+hyTKU0GkQMZbj+v9tQNi19oPy/91wYK0gTGrm" +
  "3c5Y3hCN6P8zyVq9Baf4/0qIKJSO3Nr/oS/S/5QeKK3noPr/t5solNBHqf9/EiutIqw5vUrfsv8vpyh7VL+6tfZwglpMICp73T3a/23fWvdJ41r/" +
  "lt/q/6W/YMXKj4jm6aD6/1bG8u+DeUBaa3NIc7Hy4v9Qo1B7xjlyhKVH0q0cXbDm9G34/37hyv8WzoP/0Z0waxSNyP/wj4j/366B3oqAYnOU4/r/" +
  "Z0RIa5VhSaXl5vr/SI2gtW3Skdb0mVLvxEzy/xLE8P/fpzn/2dwwvWa9SpwDj/r/wJug5sgxev+CEijOMdp6vdlFsv/wnpj/b8lCjAWB+P+z3/r/" +
  "77pCzl4X+v/GTPr/0FNJxcTceP9aEILvbMQ4pd9tMLXbuMH/+KWq/6mzoP8eRJP/fNOJ5uXOaP+E8ipjhA1o//Ff+tbupVjeZxe6/z1+wP9rrGCM" +
  "Pa9QvSaDmP89GhD3QcKB95vSsvez7Zr/83m6/0HQ+f89X1HmHNdg5mWKqFpBtDuE30my/+1Y0v/rX6D/Lig5tQGsgv+CryAhZ+Pq/zc2auZDg8j/" +
  "RZ47hIbh+v9eI9r/WOP6/y3CSLXCu0Le0+FR3ifLOK2D11n/C3z6/3se+P9hF8L/KMSi/3l/OmOnoriUFqDg/yjSauYkWECUeiiYzphWW86iF2jW" +
  "0LHS920N+v9Hy+L/sTgqc1jO8v9SukKtPXywzmDcQtYgu9j3Xhma/x5VaM7dN2L/TC+K/7oqUL38jWpzcqAYY9DaeNYY14D38nD6/w==";
// Embedded density and color map extracted from the supplied visual reference.
// Keeping it inline makes the component portable: no image request or public asset is required.
const BRAIN_REFERENCE_MAP =
  "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" +
  "+vn5+PD4+LioqJCo2Pj4wJiYkPDw0/uTcIhoWKiYSKBQkHi4iDCAiFArS1sxgYi4uppqIAAAAAAAICBQ+DAoOIi4sPhgOHhIcDhQqKnq+vr68ODK" +
  "wvr6Wvj4+Pj4+Pj4uKC4+fj4+Pi4mNujo/v7gHDoeGhYYIDYWPCQeHDYuEiYsFNjcLBoqDNAcHsYAAAAALAgOHJSQpBwwODgiHjYiFhQUGjA+vr6" +
  "+vj44Or6+mr4+Pj4+Pj4+NiQ+Pn4+Mj56Yijy8vzi4O7mPhw8JCQgKCYiFhpoGAwWFAgY1B4c1trcytTUyAYGBg4IJiYwDKAcnKYwIByQKBooEiw" +
  "kNj6+vr6+Pjy+tpK+Pj4+Pn5+PjgmMDImJi5ucmImJvr+4tzo3GAeHCI4HCwiOhx2VHZYKCYIJNzIGtrO0OLc4iYiCgokECQeIBiWkh6+KjAoFCY" +
  "kDlIYKiz+fr62Pj4+vqCOPr4+PDp6fn5uan4wIiJ0YmJaMCQ+/uTaGCwkLCgoHOLkNBYg2M5kUBAMElBK4M7e3twkEigkJioaJgwMGg4MMhLWoig" +
  "eIB4i6tgiGhw8fn4+vjY+vr6UCj6+Pj4uPj58Zmh+OiIeHh4eHBoqPj4SDhAaFBqoJiDmHjQYJt7YtF5S3OAmCBzM0NwUGBw2ID4uHBYYLjQaDij" +
  "eLh4wKhzYNDJyXiT0fn5+PjS+vr6ujAg+vj4+MDx+dGR+Pm5iKBokGhYaHCYiGBLO1Jy+orCwqr6kuKakIhRSVN7MGBIK4tAoIhI8JCguNDw+Miw" +
  "UDh4SlKYUGJ5q6DA4fnAwvH5+eL6qtL6+mIoGPr4+Pjo+Pn4oci4oLDYgGAoaLhw4Ligk3OpmZKA2sKQwnrKcpiIUohQODtooCBDKDho2HiA+OjY" +
  "4NDA6KAgICFJcaGR2YCa8vr6+PrZ2frysqL6+vpiIAD4+vj4+PjR0amgmPj48NhYMFBoyJCAg2NweNLimuqqyvqK2pJamjoxIjgAADgjaEDIeJjI" +
  "0IjI4Pj4+JiwMiBxcXm5gojS+vr6+vj6yPjIyvLC+vrKYiAA+Pr4+Pn4+PDosLD4yKCwgFBg2LCja5t7sZmSspr6spLKesqCUtJKiXEAAAAAAGBQ" +
  "cGiQkNDA6Pj4wPjYekIqOWoycsq6+vr6+vri+fL6+vrY+vLiklIYAPj6+vr5+PjQ2LD48KKSoIiASJjBq5GYmZiSmvqq0vp62rBq2kpCOCkAAAAA" +
  "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";
const CONTINENTS: Array<Array<[number, number]>> = [
  [[-168, 68], [-145, 72], [-126, 62], [-123, 48], [-115, 32], [-105, 24], [-96, 17], [-86, 20], [-81, 26], [-80, 34], [-74, 42], [-62, 49], [-57, 54], [-63, 61], [-80, 70], [-98, 76], [-120, 72], [-145, 60]],
  [[-81, 12], [-74, 10], [-64, 10], [-53, 5], [-44, -3], [-35, -7], [-37, -16], [-42, -23], [-49, -30], [-55, -36], [-61, -43], [-67, -55], [-73, -51], [-75, -40], [-72, -27], [-76, -14], [-81, -4]],
  [[-10, 36], [-6, 43], [2, 44], [8, 48], [13, 54], [9, 57], [17, 61], [24, 69], [31, 70], [40, 62], [47, 57], [40, 49], [31, 46], [26, 39], [17, 41], [10, 37], [2, 36]],
  [[-17, 34], [-8, 36], [8, 37], [21, 33], [31, 31], [34, 24], [43, 13], [51, 11], [44, 0], [40, -11], [35, -22], [28, -34], [18, -35], [11, -27], [8, -5], [2, 5], [-8, 5], [-16, 14]],
  [[28, 41], [39, 42], [47, 49], [57, 54], [69, 61], [88, 68], [110, 72], [135, 67], [160, 60], [175, 52], [161, 48], [146, 44], [136, 35], [125, 39], [117, 24], [110, 19], [105, 9], [99, 4], [97, 19], [90, 22], [84, 9], [77, 7], [72, 20], [62, 25], [54, 28], [47, 32], [38, 35]],
  [[112, -13], [127, -12], [140, -12], [151, -22], [153, -33], [144, -39], [132, -34], [119, -35], [113, -26]],
  [[-73, 60], [-58, 61], [-44, 66], [-29, 74], [-21, 82], [-46, 83], [-63, 77]],
  [[-8, 50], [1, 51], [2, 58], [-4, 59], [-8, 55]],
];

function clamp(value: number, min = 0, max = 1) { return Math.min(max, Math.max(min, value)); }
function smoothstep(min: number, max: number, value: number) { const t = clamp((value - min) / (max - min)); return t * t * (3 - 2 * t); }
function linearstep(min: number, max: number, value: number) { return clamp((value - min) / (max - min)); }
function isLand(longitude: number, latitude: number) {
  return CONTINENTS.some((polygon) => {
    let inside = false;
    for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
      const [ax, ay] = polygon[index], [bx, by] = polygon[previous];
      if ((ay > latitude) !== (by > latitude) && longitude < (bx - ax) * (latitude - ay) / (by - ay) + ax) inside = !inside;
    }
    return inside;
  });
}

let referenceBlueprint: ReferenceBlueprint | null = null;

function getReferenceBlueprint() {
  if (referenceBlueprint) return referenceBlueprint;

  const encodedPixels = atob(BRAIN_REFERENCE_MAP);
  const encodedParticles = atob(BRAIN_PARTICLE_BLUEPRINT);
  const samples: ReferenceSample[] = [];
  const densityAt = (column: number, row: number) => {
    if (column < 0 || column >= BRAIN_REFERENCE_WIDTH || row < 0 || row >= BRAIN_REFERENCE_HEIGHT) return 0;
    const pixel = encodedPixels.charCodeAt(row * BRAIN_REFERENCE_WIDTH + column);
    return pixel ? (pixel >> 3) / 31 : 0;
  };

  for (let index = 0; index + 3 < encodedParticles.length; index += 4) {
    const horizontal = encodedParticles.charCodeAt(index) / 255;
    const vertical = encodedParticles.charCodeAt(index + 1) / 255;
    const attributes = encodedParticles.charCodeAt(index + 2);
    const signal = (attributes >> 3) / 31;
    const pigment = attributes & 7;
    const density = encodedParticles.charCodeAt(index + 3) / 255;
    const column = Math.min(BRAIN_REFERENCE_WIDTH - 1, Math.floor(horizontal * BRAIN_REFERENCE_WIDTH));
    const row = Math.min(BRAIN_REFERENCE_HEIGHT - 1, Math.floor(vertical * BRAIN_REFERENCE_HEIGHT));
    const leftDensity = densityAt(column - 1, row);
    const rightDensity = densityAt(column + 1, row);
    const topDensity = densityAt(column, row - 1);
    const bottomDensity = densityAt(column, row + 1);
    const edge = !leftDensity || !rightDensity || !topDensity || !bottomDensity;
    const ridge = density - (leftDensity + rightDensity + topDensity + bottomDensity) * .25;
    const light = clamp(.46 + signal * .34 + density * .24 + ridge * .4
      + (leftDensity - rightDensity) * .1 + (topDensity - bottomDensity) * .16, .2, 1.16);
    samples.push({
      x: (horizontal - .5) * 2.1,
      y: (vertical - .5) * 1.68 - .025,
      density,
      signal,
      pigment,
      edge,
      light,
    });
  }

  referenceBlueprint = { samples };
  return referenceBlueprint;
}

function referenceColor(pigment: number, density: number, layer: NeuralPoint["layer"], random: () => number) {
  const variation = random();
  if (layer === "ambient") return variation < .48 ? "#9f7af0" : variation < .8 ? "#e9bd64" : "#72cfbd";
  if (layer === "stem") return variation < .61 ? "#f1c564" : variation < .83 ? "#a98bf3" : "#f6f1ff";
  if (density < .28) return variation < .58 ? "#5f5875" : variation < .82 ? "#776995" : "#756345";
  if (pigment === 2) return variation < .68 ? "#f5c13f" : variation < .9 ? "#ffdf87" : "#fff0c8";
  if (pigment === 1) return variation < .67 ? "#a277fa" : variation < .89 ? "#c5a6ff" : "#f0e7ff";
  if (pigment === 3) return variation < .62 ? "#75d9ba" : variation < .84 ? "#b29bf4" : "#eefff8";
  if (density > .74) return variation < .73 ? "#fffaff" : variation < .92 ? "#e9e4ff" : "#d1c1ff";
  return variation < .62 ? "#e2dce9" : variation < .87 ? "#bcb2cd" : "#a18acb";
}

function createPoints(count: number): NeuralPoint[] {
  let seed = 928472;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const blueprint = getReferenceBlueprint();
  return Array.from({ length: count }, (_, index) => {
    let x = 0, y = 0, z = 0, rim = false;
    let density = .42, signal = .45, pigment = 0, relief = .5;
    let layer: NeuralPoint["layer"] = "cortex";
    if (index % 127 === 0) {
      layer = "ambient";
      const angle = random() * TAU;
      const distance = 1.1 + Math.pow(random(), .65) * .57;
      x = Math.cos(angle) * distance;
      y = Math.sin(angle) * distance * .76;
      z = (random() - .5) * .38;
      relief = .18;
    } else if (index % 67 === 0) {
      layer = "stem";
      const stemProgress = random();
      x = .065 + stemProgress * .058 + (random() - .5) * (.1 - stemProgress * .047);
      y = .68 + stemProgress * .4;
      z = (random() - .5) * (.14 - stemProgress * .05);
      relief = .45;
    } else {
      const sample = blueprint.samples[index % blueprint.samples.length];
      x = sample.x + (random() - .5) * .006;
      y = sample.y + (random() - .5) * .006;
      density = sample.density;
      signal = sample.signal;
      pigment = sample.pigment;
      rim = sample.edge;
      layer = sample.edge ? "rim" : signal > .66 || density > .85 ? "ridge" : y > .3 && x < -.24 ? "cerebellum" : "cortex";
      const normalizedX = x / 1.08;
      const normalizedY = (y + .035) / .85;
      const bodyDepth = Math.sqrt(Math.max(0, 1 - normalizedX * normalizedX * .77 - normalizedY * normalizedY * .82));
      z = bodyDepth * .25 + density * .14 + signal * .13 + (random() - .55) * .07;
      relief = clamp(.15 + signal * .44 + density * .27 + bodyDepth * .1
        + sample.light * .1 + (sample.edge ? .06 : 0), .12, 1);
    }

    const color = referenceColor(pigment, density, layer, random);
    let globeLongitude = 0, globeLatitude = 0, land = false;
    const preferLand = index % 5 !== 0;
    for (let attempt = 0; attempt < 42; attempt++) {
      globeLongitude = random() * 360 - 180;
      globeLatitude = Math.asin(random() * 2 - 1) * 180 / Math.PI;
      land = isLand(globeLongitude, globeLatitude);
      if (land === preferLand) break;
    }
    const globeLon = globeLongitude * Math.PI / 180, globeLat = globeLatitude * Math.PI / 180;
    const globeX = Math.sin(globeLon) * Math.cos(globeLat) * 1.08;
    const globeY = -Math.sin(globeLat) * 1.08;
    const globeZ = Math.cos(globeLon) * Math.cos(globeLat) * 1.08;
    const tunnelAngle = random() * TAU, tunnelRadius = .26 + Math.pow(random(), .55) * 2.8;
    const size = layer === "ambient" ? .48 + random() * .96 : .58 + random() * .65 + signal * .51 + density * .34;
    return { x, y, z, globeX, globeY, globeZ, land, scatterX: (random() - .5) * 2.5, scatterY: (random() - .5) * 2, scatterZ: (random() - .5) * 2, tunnelX: Math.cos(tunnelAngle) * tunnelRadius, tunnelY: Math.sin(tunnelAngle) * tunnelRadius * .72, tunnelZ: random() * 10 - 1, size, color, phase: random() * TAU, outline: index % 6 !== 0, rim, layer, relief };
  });
}

function createSynapses(count: number): Synapse[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = index * 2.39996323, radius = .38 + Math.sqrt(index / count) * 2.7;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius * .67, z: ((index * 1.731) % 6) - 1, radius: 3 + (index % 5) * 1.3, phase: index * 1.37, color: COLORS[index % 3] };
  });
}

function NeuralCanvas({ progress }: { progress: React.RefObject<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactLayout = window.innerWidth < 760;
    const points = createPoints(compactLayout ? 1500 : 3000), synapses = createSynapses(48);
    const frameInterval = 1000 / (compactLayout ? 30 : 45);
    let width = 0, height = 0, frame = 0, pointerX = 0, pointerY = 0, smoothX = 0, smoothY = 0;
    let visible = true, lastRenderedAt = 0;
    const resize = () => {
      width = window.innerWidth; height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, compactLayout ? 1.2 : 1.4);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const move = (event: PointerEvent) => { pointerX = (event.clientX / width - .5) * 2; pointerY = (event.clientY / height - .5) * 2; };
    const render = (now: number) => {
      frame = 0;
      if (!visible || document.hidden) return;
      if (now - lastRenderedAt < frameInterval) {
        frame = window.requestAnimationFrame(render);
        return;
      }
      lastRenderedAt = now;
      const time = reducedMotion.matches ? 0 : now * .00032;
      const position = progress.current, globeMix = linearstep(0, .5, position), interior = linearstep(.5, 1, position), mobile = width < 760;
      const globeVisibility = globeMix * (1 - interior), dissolve = Math.sin(Math.PI * globeMix) * (1 - interior);
      smoothX += (pointerX - smoothX) * .032; smoothY += (pointerY - smoothY) * .032;
      context.fillStyle = "#07070b"; context.fillRect(0, 0, width, height);
      const baseScale = Math.min(width * (mobile ? .445 : .33), height * (mobile ? .455 : .42));
      const desktopRightCenter = Math.min(width * .72, width - baseScale * 1.08 - 8);
      const desktopLeftCenter = Math.max(width * .28, baseScale * 1.08 + 8);
      const worldShift = linearstep(.17, .36, position);
      const worldCenter = desktopRightCenter + (desktopLeftCenter - desktopRightCenter) * worldShift;
      const centerX = mobile ? width * .51 : worldCenter + (width * .52 - worldCenter) * interior;
      const centerY = height * (mobile ? .43 : .505);
      // The brain is exclusively made of particles: empty space remains truly black.
      if (globeVisibility > .035 || interior > .035) {
        const glowStrength = globeVisibility * .055 + interior * .11;
        const backgroundGlow = context.createRadialGradient(centerX, centerY, baseScale * .08, centerX, centerY, baseScale * (1.45 + interior));
        backgroundGlow.addColorStop(0, `rgba(103,75,196,${glowStrength})`);
        backgroundGlow.addColorStop(.53, `rgba(47,32,91,${glowStrength * .61})`);
        backgroundGlow.addColorStop(1, "rgba(7,7,11,0)");
        context.fillStyle = backgroundGlow;
        context.fillRect(0, 0, width, height);
      }
      if (globeVisibility > .08) {
        const globeRadius = baseScale * 1.08;
        context.globalAlpha = globeVisibility * .13;
        context.strokeStyle = "#9c83ec"; context.lineWidth = .8;
        context.beginPath(); context.arc(centerX, centerY, globeRadius, 0, TAU); context.stroke();
        for (let band = -2; band <= 2; band++) {
          const latitude = band * .29, horizontal = Math.sqrt(1 - latitude * latitude) * globeRadius;
          context.beginPath(); context.ellipse(centerX, centerY + latitude * globeRadius, horizontal, Math.max(2, horizontal * .1), 0, 0, TAU); context.stroke();
        }
        for (let meridian = 1; meridian < 4; meridian++) {
          context.beginPath(); context.ellipse(centerX, centerY, globeRadius * meridian / 4, globeRadius, 0, 0, TAU); context.stroke();
        }
        context.globalAlpha = 1;
      }
      if (interior > .05) {
        context.lineWidth = .7;
        for (let index = 0; index < synapses.length; index++) {
          const first = synapses[index], second = synapses[(index + 5 + index % 4) % synapses.length];
          const drift = (time * .68 + position * 4 + first.z + 6) % 6, depth = 1 / (.32 + drift * .45);
          const ax = centerX + first.x * baseScale * depth, ay = centerY + first.y * baseScale * depth, bx = centerX + second.x * baseScale * depth * .89, by = centerY + second.y * baseScale * depth * .89;
          if (ax < -200 || ax > width + 200 || ay < -200 || ay > height + 200 || bx < -200 || bx > width + 200 || by < -200 || by > height + 200) continue;
          context.globalAlpha = interior * clamp(depth * .17, .035, .19); context.strokeStyle = first.color;
          context.beginPath(); context.moveTo(ax, ay); context.bezierCurveTo(ax + (bx - ax) * .26 - 24, ay + (by - ay) * .42 + 22, ax + (bx - ax) * .71 + 18, ay + (by - ay) * .67 - 18, bx, by); context.stroke();
          const signal = (time * .75 + first.phase) % 1;
          context.globalAlpha = interior * .7; context.fillStyle = first.color;
          context.beginPath(); context.arc(ax + (bx - ax) * signal, ay + (by - ay) * signal, 1.55, 0, TAU); context.fill();
        }
      }
      const rotation = Math.sin(time * .31) * .105 + smoothX * .082;
      const cos = Math.cos(rotation), sin = Math.sin(rotation);
      const globeRotation = Math.sin(time * .11) * .16 - .09 + smoothX * .13;
      const globeCos = Math.cos(globeRotation), globeSin = Math.sin(globeRotation);
      const strokeBatches = new Map<string, ParticleBatch>();
      const fillBatches = new Map<string, ParticleBatch>();

      for (let index = 0; index < points.length; index++) {
        const point = points[index];
        const brainX = point.x * cos - point.z * sin, brainZ = point.x * sin + point.z * cos;
        const globeX = point.globeX * globeCos - point.globeZ * globeSin, globeZ = point.globeX * globeSin + point.globeZ * globeCos;
        const assembledX = brainX * (1 - globeMix) + globeX * globeMix + point.scatterX * dissolve * .47;
        const assembledY = point.y * (1 - globeMix) + point.globeY * globeMix + point.scatterY * dissolve * .47;
        const assembledZ = brainZ * (1 - globeMix) + globeZ * globeMix + point.scatterZ * dissolve * .25;
        const flow = interior > .01 ? ((point.tunnelZ - position * 8 - time * .22 + 20) % 10) - 1 : 0;
        const depth = interior > .01 ? 1 / (.28 + Math.max(.1, flow) * .32) : 1;
        const morphX = assembledX * (1 - interior) + point.tunnelX * depth * interior, morphY = assembledY * (1 - interior) + point.tunnelY * depth * interior;
        const perspective = 1 + assembledZ * (.112 + globeMix * .032) * (1 - interior);
        const screenX = centerX + morphX * baseScale * perspective + smoothX * 8;
        const screenY = centerY + morphY * baseScale * perspective + smoothY * 6;
        if (screenX < -16 || screenX > width + 16 || screenY < -16 || screenY > height + 16) continue;
        const pulse = Math.sin(time * 2 + point.phase) * .15 + .85, fade = interior > .1 ? clamp(depth * .63, .07, 1) : 1;
        const hemisphere = globeMix > .1 ? clamp(.17 + (globeZ + 1.08) * .38, .12, 1) : 1;
        const landContrast = globeVisibility > .12 && !point.land ? 1 - globeVisibility * .75 : 1;
        const continentBrightness = globeVisibility > .2 && point.land ? 1 + globeVisibility * .24 : 1;
        const rimBoost = point.rim ? (1 - globeMix) * (1 - interior) : 0;
        const ridgeBoost = point.layer === "ridge" ? (1 - globeMix) * (1 - interior) : 0;
        const brainPresence = (1 - globeMix) * (1 - interior);
        const surfaceLight = 1 - brainPresence + brainPresence * (.31 + point.relief * .97);
        const ambientFade = point.layer === "ambient" ? .19 + globeMix * .81 : 1;
        const opacity = clamp(
          (.64 + (assembledZ + .43) * .36) * pulse * fade * hemisphere * landContrast
          * continentBrightness * surfaceLight * ambientFade * (1 + rimBoost * .36 + ridgeBoost * .18),
          0,
          .98,
        );
        if (opacity < .035) continue;
        const size = point.size * (mobile ? 1.04 : 1.31) * (1 + rimBoost * .1 + ridgeBoost * .06)
          * (1 + globeVisibility * (point.land ? .35 : -.12))
          * (1 + interior * clamp(depth - .4, 0, 1));
        const particleColor = globeVisibility > .45 && !point.land
          ? "#605780"
          : globeVisibility > .45 && point.land && index % 7 === 0 ? "#f0cb77" : point.color;
        const quantizedAlpha = Math.max(.1, Math.min(.95, Math.round(opacity * 9) / 9));
        const key = `${particleColor}:${quantizedAlpha}`;

        if (point.outline && size > .96) {
          let batch = strokeBatches.get(key);
          if (!batch) {
            batch = { path: new Path2D(), color: particleColor, alpha: quantizedAlpha };
            strokeBatches.set(key, batch);
          }
          const glyph = index % 11;
          if (glyph < 2) {
            const side = size * 1.48;
            batch.path.rect(screenX - side * .5, screenY - side * .5, side, side);
          } else if (glyph === 2) {
            batch.path.moveTo(screenX, screenY - size * .98);
            batch.path.lineTo(screenX - size * .9, screenY);
            batch.path.lineTo(screenX, screenY + size * .98);
            batch.path.lineTo(screenX + size * .9, screenY);
            batch.path.closePath();
          } else {
            const orientation = index % 3 === 0 ? -1 : 1;
            batch.path.moveTo(screenX, screenY - size * 1.31 * orientation);
            batch.path.lineTo(screenX - size * 1.12, screenY + size * .78 * orientation);
            batch.path.lineTo(screenX + size * 1.12, screenY + size * .78 * orientation);
            batch.path.closePath();
          }
        } else {
          let batch = fillBatches.get(key);
          if (!batch) {
            batch = { path: new Path2D(), color: particleColor, alpha: quantizedAlpha };
            fillBatches.set(key, batch);
          }
          batch.path.moveTo(screenX + size * .7, screenY);
          batch.path.arc(screenX, screenY, size * .7, 0, TAU);
        }
      }

      context.lineWidth = mobile ? .79 : 1.03;
      for (const batch of strokeBatches.values()) {
        context.globalAlpha = batch.alpha;
        context.strokeStyle = batch.color;
        context.stroke(batch.path);
      }
      for (const batch of fillBatches.values()) {
        context.globalAlpha = batch.alpha;
        context.fillStyle = batch.color;
        context.fill(batch.path);
      }

      if (interior > .1) for (const synapse of synapses) {
        const drift = (time * .68 + position * 4 + synapse.z + 6) % 6, depth = 1 / (.32 + drift * .45), x = centerX + synapse.x * baseScale * depth, y = centerY + synapse.y * baseScale * depth;
        if (x < -70 || x > width + 70 || y < -70 || y > height + 70) continue;
        const radius = synapse.radius * depth * (1 + Math.sin(time * 2 + synapse.phase) * .16), aura = context.createRadialGradient(x, y, 0, x, y, radius * 5);
        aura.addColorStop(0, synapse.color); aura.addColorStop(.13, `${synapse.color}aa`); aura.addColorStop(1, `${synapse.color}00`);
        context.globalAlpha = interior * clamp(depth * .46, .09, .72); context.fillStyle = aura; context.beginPath(); context.arc(x, y, radius * 5, 0, TAU); context.fill();
      }
      context.globalAlpha = 1;
      frame = window.requestAnimationFrame(render);
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      } else if (!frame && !document.hidden) {
        frame = window.requestAnimationFrame(render);
      }
    });
    const handleVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      } else if (visible && !frame) {
        frame = window.requestAnimationFrame(render);
      }
    };

    resize();
    visibilityObserver.observe(canvas);
    frame = window.requestAnimationFrame(render);
    window.addEventListener("resize", resize, { passive: true }); window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.cancelAnimationFrame(frame);
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, [progress]);
  return <canvas ref={canvasRef} className="neural-canvas" aria-hidden="true" />;
}

function DnaHelixVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    type FlowStrand = {
      lane: number;
      phase: number;
      wobble: number;
      depth: number;
      accent: boolean;
      color: string;
      alpha: number;
      size: number;
      speed: number;
    };

    let seed = 271828;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    // La referencia no es una hélice: es un haz de "datos" que se estrecha
    // alrededor del núcleo y vuelve a abrirse. Cada hebra tiene profundidad,
    // fase y velocidad distintas para evitar un patrón mecánico.
    const compactLayout = window.innerWidth < 760;
    const palette = ["#a487ff", "#8c75c7", "#c5b8ea", "#75d9bd", "#e5bd73"];
    const strands: FlowStrand[] = Array.from({ length: 78 }, (_, index) => {
      const lane = index / 77 * 2.24 - 1.12;
      const accent = index === 7 || index === 21 || index === 39 || index === 58 || index === 72;
      return {
        lane,
        phase: random() * TAU,
        wobble: .55 + random() * 1.15,
        depth: .55 + random() * .9,
        accent,
        color: accent
          ? (index === 7 || index === 58 ? "#75d9bd" : index === 21 || index === 72 ? "#e5bd73" : "#e1d7ff")
          : palette[Math.floor(random() * 3)],
        alpha: accent ? .72 : .16 + random() * .27,
        size: accent ? 1.2 : .52 + random() * .54,
        speed: .35 + random() * .65,
      };
    });

    const dust = Array.from({ length: 100 }, () => ({
      x: 24 + random() * 472,
      y: 20 + random() * 472,
      size: random() < .84 ? .7 : 1.25,
      alpha: .035 + random() * .12,
      phase: random() * TAU,
      color: random() < .72 ? "#a487ff" : random() < .58 ? "#75d9bd" : "#e5bd73",
    }));

    const signals = Array.from({ length: 20 }, (_, index) => ({
      lane: -1.08 + random() * 2.16,
      offset: index / 20,
      speed: .018 + random() * .018,
      size: 1.1 + random() * 1.25,
      color: index % 3 === 0 ? "#75d9bd" : index % 3 === 1 ? "#e5bd73" : "#cbb8ff",
      phase: random() * TAU,
    }));

    let width = 1;
    let height = 1;
    let ratio = 1;
    let frame = 0;
    let startTime = 0;
    let progress = 0;
    let started = false;
    let visible = false;
    let pointerX = 0;
    let pointerY = 0;
    let lastRenderedAt = 0;
    const frameInterval = 1000 / (compactLayout ? 30 : 40);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particleNoise = (value: number) => {
      const noise = Math.sin(value * 12.9898 + 78.233) * 43758.5453;
      return noise - Math.floor(noise);
    };

    const centerAt = (t: number) => {
      // Curva diagonal con una S muy suave, equivalente al gesto de la referencia.
      const x =
        4 +
        518 * t +
        Math.sin((t - .08) * Math.PI * 1.45) * 24 -
        Math.sin(t * Math.PI * 3.1) * 7;

      const y =
        522 -
        506 * t +
        Math.sin((t + .14) * Math.PI * 1.7) * 30 +
        Math.sin(t * Math.PI * 2.8) * 8;

      return { x, y };
    };

    const ribbonWidth = (t: number) => {
      // Estrecho en el centro, abierto en ambas salidas.
      const waist = Math.abs(t - .52) * 2;
      const base = 28 + Math.pow(waist, 1.08) * 122;
      const lobes = 20 * Math.sin(t * Math.PI * 3.15 + .55) ** 2;
      return base + lobes;
    };

    const strandPoint = (t: number, lane: number, phase: number, wobble: number, time: number) => {
      const p = centerAt(t);
      const before = centerAt(Math.max(0, t - .0025));
      const after = centerAt(Math.min(1, t + .0025));
      const tx = after.x - before.x;
      const ty = after.y - before.y;
      const len = Math.max(.0001, Math.hypot(tx, ty));
      const nx = -ty / len;
      const ny = tx / len;

      const widthHere = ribbonWidth(t);
      const wave =
        Math.sin(t * TAU * 2.05 + phase + (reducedMotion ? 0 : time * .00013 * wobble)) *
        (5 + 10 * Math.abs(lane));
      const layered = lane * widthHere + wave;
      const perspective = 1 + Math.sin(t * TAU * 1.82 + phase) * .055;

      return {
        x: p.x + nx * layered * perspective,
        y: p.y + ny * layered * perspective,
      };
    };

    const drawGlowDot = (x: number, y: number, radius: number, color: string, alpha: number) => {
      const gradient = context.createRadialGradient(x, y, 0, x, y, radius * 5.5);
      gradient.addColorStop(0, color);
      gradient.addColorStop(.16, `${color}c8`);
      gradient.addColorStop(.48, `${color}32`);
      gradient.addColorStop(1, `${color}00`);
      context.globalAlpha = alpha;
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x, y, radius * 5.5, 0, TAU);
      context.fill();

      context.globalAlpha = Math.min(1, alpha * 1.45);
      context.fillStyle = color;
      context.beginPath();
      context.arc(x, y, radius, 0, TAU);
      context.fill();
    };

    const drawEnergyStar = (x: number, y: number, size: number, color: string, alpha: number) => {
      drawGlowDot(x, y, size, color, alpha);
      context.globalAlpha = alpha * .5;
      context.fillStyle = color;
      context.fillRect(x - size * 7, y - .35, size * 14, .7);
      context.fillRect(x - .35, y - size * 4.5, .7, size * 9);
      context.globalAlpha = alpha * .22;
      context.fillRect(x - size * 11, y - .2, size * 22, .4);
    };

    const draw = (value: number, time = 0) => {
      progress = value;

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);

      const scale = Math.min(width / 520, height / 520);
      const offsetX = (width - 520 * scale) / 2;
      const offsetY = (height - 520 * scale) / 2;

      context.save();
      context.translate(offsetX, offsetY);
      context.scale(scale, scale);

      const entrance = smoothstep(0, .82, value);
      const sceneOpacity = .42 + entrance * .58;
      const breathe = reducedMotion ? 0 : Math.sin(time * .00048) * 1.4;

      // Halo ambiental extremadamente tenue. No crea una "nube": sólo separa
      // el haz del negro como en la referencia.
      const aura = context.createRadialGradient(292, 268, 28, 292, 268, 252);
      aura.addColorStop(0, `rgba(111,77,180,${.032 + entrance * .025})`);
      aura.addColorStop(.52, `rgba(63,43,105,${.018 + entrance * .012})`);
      aura.addColorStop(1, "rgba(24,15,41,0)");
      context.fillStyle = aura;
      context.fillRect(0, 0, 520, 520);

      // Dos halos profundos dan volumen a los lóbulos sin crear un fondo sólido.
      const lobePulse = reducedMotion ? 1 : .88 + Math.sin(time * .00062) * .12;
      for (const lobe of [
        { t: .24, color: "rgba(117,217,189,.055)" },
        { t: .78, color: "rgba(164,135,255,.075)" },
      ]) {
        const point = centerAt(lobe.t);
        const glow = context.createRadialGradient(point.x, point.y, 10, point.x, point.y, 138 * lobePulse);
        glow.addColorStop(0, lobe.color);
        glow.addColorStop(1, "rgba(7,7,11,0)");
        context.globalAlpha = entrance;
        context.fillStyle = glow;
        context.beginPath();
        context.arc(point.x, point.y, 138 * lobePulse, 0, TAU);
        context.fill();
      }

      for (const particle of dust) {
        const pulse = reducedMotion ? 1 : .62 + Math.sin(time * .0011 + particle.phase) * .33;
        context.globalAlpha = particle.alpha * pulse * entrance;
        context.fillStyle = particle.color;
        context.fillRect(particle.x, particle.y, particle.size, particle.size);
      }

      // Hebras de puntos. El barrido de entrada hace que la red se "construya"
      // desde abajo-izquierda hacia arriba-derecha.
      context.globalCompositeOperation = "lighter";
      for (let strandIndex = 0; strandIndex < strands.length; strandIndex += 1) {
        const strand = strands[strandIndex];
        const samples = width < 480 ? 86 : 112;

        for (let i = 0; i < samples; i += 1) {
          const t = i / (samples - 1);
          const particleId = strandIndex * 173 + i;
          const delay = t * .52 + particleNoise(particleId + 7) * .14;
          const assemble = smoothstep(delay, delay + .28, value);

          const p = strandPoint(t, strand.lane, strand.phase, strand.wobble, time);
          const depthPulse = .74 + Math.sin(t * TAU * 1.65 + strand.phase) * .26;
          const shimmer = reducedMotion
            ? .92
            : .72 + Math.sin(time * .0016 * strand.speed + i * .23 + strand.phase) * .24;

          // Pequeño empuje por puntero para dar profundidad sin deformar el diseño.
          const dx = p.x - 272;
          const dy = p.y - 266;
          const parallax = strand.depth * .65;

          const targetX = p.x + pointerX * parallax * (Math.abs(dx) / 320);
          const targetY = p.y + pointerY * parallax * (Math.abs(dy) / 320);
          const originX = 24 + particleNoise(particleId + 31) * 472;
          const originY = 20 + particleNoise(particleId + 79) * 472;
          const travelArc = Math.sin(assemble * Math.PI);
          const x = originX + (targetX - originX) * assemble + (particleNoise(particleId + 113) - .5) * travelArc * 46;
          const y = originY + (targetY - originY) * assemble + (particleNoise(particleId + 149) - .5) * travelArc * 34;

          const waistBoost = 1 - Math.min(1, Math.abs(t - .53) * 2);
          const assemblyVisibility = .16 + assemble * .84;
          const alpha =
            strand.alpha *
            depthPulse *
            shimmer *
            assemblyVisibility *
            sceneOpacity *
            (.84 + waistBoost * .42);

          const size = strand.size * (.78 + strand.depth * .18) * (1 + waistBoost * .08);

          context.globalAlpha = alpha;
          context.fillStyle = strand.color;

          // Alternar punto / micro-cuadrado imita el tramado tecnológico de la referencia.
          if ((strandIndex + i) % 7 === 0) {
            context.fillRect(x - size * .55, y - size * .55, size * 1.1, size * 1.1);
          } else {
            context.beginPath();
            context.arc(x, y, size * .48, 0, TAU);
            context.fill();
          }

          if (strand.accent && assemble > .58 && i % 24 === strandIndex % 6) {
            drawGlowDot(x, y, size * .48, strand.color, alpha * .34 * assemble);
          }
        }
      }

      // Un frente luminoso recorre la figura mientras ordena las partículas.
      const buildHead = clamp((value - .035) / .79);
      const buildEnergy = Math.sin(clamp((value - .02) / .94) * Math.PI);
      if (buildEnergy > .015 && value < .97) {
        const head = centerAt(buildHead);
        const before = centerAt(Math.max(0, buildHead - .004));
        const after = centerAt(Math.min(1, buildHead + .004));
        const tangentX = after.x - before.x;
        const tangentY = after.y - before.y;
        const tangentLength = Math.max(.001, Math.hypot(tangentX, tangentY));
        const normalX = -tangentY / tangentLength;
        const normalY = tangentX / tangentLength;
        const frontWidth = ribbonWidth(buildHead) * 1.06;
        const frontGradient = context.createLinearGradient(
          head.x - normalX * frontWidth,
          head.y - normalY * frontWidth,
          head.x + normalX * frontWidth,
          head.y + normalY * frontWidth,
        );
        frontGradient.addColorStop(0, "rgba(164,135,255,0)");
        frontGradient.addColorStop(.28, "rgba(117,217,189,.36)");
        frontGradient.addColorStop(.5, "rgba(244,238,255,.9)");
        frontGradient.addColorStop(.72, "rgba(229,189,115,.36)");
        frontGradient.addColorStop(1, "rgba(164,135,255,0)");
        context.globalAlpha = buildEnergy * .7;
        context.strokeStyle = frontGradient;
        context.lineWidth = 1;
        context.shadowColor = "#bda3ff";
        context.shadowBlur = 15;
        context.beginPath();
        context.moveTo(head.x - normalX * frontWidth, head.y - normalY * frontWidth);
        context.lineTo(head.x + normalX * frontWidth, head.y + normalY * frontWidth);
        context.stroke();
        context.shadowBlur = 0;
        drawEnergyStar(head.x, head.y, 2.7, "#eee7ff", buildEnergy * .82);
      }

      // Puentes punteados entre los extremos convierten el haz en una malla
      // tridimensional y ocupan los huecos sin crear superficies sólidas.
      for (let bridge = 0; bridge < 28; bridge += 1) {
        const t = (bridge + .5) / 28;
        const phase = bridge * .71 + .35;
        const from = strandPoint(t, -.98, phase, .8, time);
        const to = strandPoint(t, .98, phase + .18, .8, time);
        const bridgeReveal = smoothstep(.54 + t * .22, Math.min(1, .76 + t * .22), value);
        const bridgeColor = bridge % 5 === 0 ? "#75d9bd" : bridge % 5 === 2 ? "#e5bd73" : "#a487ff";

        for (let point = 1; point < 26; point += 1) {
          const mix = point / 26;
          const x = from.x + (to.x - from.x) * mix;
          const y = from.y + (to.y - from.y) * mix;
          const centerGlow = 1 - Math.abs(mix - .5) * 1.5;
          context.globalAlpha = (.055 + centerGlow * .09) * bridgeReveal * entrance;
          context.fillStyle = bridgeColor;
          const pixelSize = .42 + centerGlow * .28;
          context.fillRect(x - pixelSize / 2, y - pixelSize / 2, pixelSize, pixelSize);
        }
      }

      // Señales luminosas recorriendo el flujo.
      const signalReveal = smoothstep(.72, 1, value);
      for (const signal of signals) {
        const t = reducedMotion
          ? signal.offset
          : (signal.offset + time * signal.speed * .001) % 1;

        const p = strandPoint(t, signal.lane, signal.phase, 1, time);
        const pulse = reducedMotion ? 1 : .72 + Math.sin(time * .004 + signal.phase) * .28;

        // Estela corta: aporta dirección sin convertir las señales en líneas continuas.
        if (!reducedMotion) {
          for (let trail = 4; trail >= 1; trail -= 1) {
            const trailT = (t - trail * .006 + 1) % 1;
            const trailPoint = strandPoint(trailT, signal.lane, signal.phase, 1, time);
            const trailAlpha = signalReveal * (5 - trail) * .045;
            context.globalAlpha = trailAlpha;
            context.fillStyle = signal.color;
            const trailSize = signal.size * (1 - trail * .13);
            context.fillRect(trailPoint.x - trailSize / 2, trailPoint.y - trailSize / 2, trailSize, trailSize);
          }
        }
        drawGlowDot(p.x, p.y, signal.size * pulse, signal.color, .72 * signalReveal);
      }

      // Impulsos alrededor del cuello central: el flujo se concentra aquí
      // sin necesidad de un núcleo gráfico superpuesto.
      const hub = centerAt(.53);
      const orbital = [
        { a: -2.46, c: "#75d9bd" },
        { a: -1.02, c: "#e5bd73" },
        { a: 2.34, c: "#8fb8ff" },
        { a: .72, c: "#c6a9ff" },
      ];
      orbital.forEach((pulse, index) => {
        const phase = reducedMotion ? .62 : (time * .00013 + index * .21) % 1;
        const r = 36 + phase * 28;
        const x = hub.x + Math.cos(pulse.a) * r;
        const y = hub.y + Math.sin(pulse.a) * r;
        drawGlowDot(x, y, 1.15 + (1 - phase) * .55, pulse.c, (.46 - phase * .22) * signalReveal);
      });

      // Brillo del cuello central: muy localizado para conservar contraste.
      const coreAura = context.createRadialGradient(274, 266, 3, 274, 266, 58 + breathe);
      coreAura.addColorStop(0, "rgba(164,135,255,.12)");
      coreAura.addColorStop(.32, "rgba(164,135,255,.045)");
      coreAura.addColorStop(1, "rgba(164,135,255,0)");
      context.globalAlpha = signalReveal;
      context.fillStyle = coreAura;
      context.beginPath();
      context.arc(274, 266, 60 + breathe, 0, TAU);
      context.fill();

      // Una onda de choque muy breve sella la construcción de la malla.
      const completion = linearstep(.78, 1, value);
      const shockAlpha = Math.sin(completion * Math.PI) * .5;
      if (shockAlpha > .01) {
        const shockRadius = 22 + completion * 105;
        context.globalAlpha = shockAlpha;
        context.strokeStyle = "rgba(198,169,255,.72)";
        context.lineWidth = .8;
        context.beginPath();
        context.ellipse(hub.x, hub.y, shockRadius * 1.25, shockRadius * .58, -.76, 0, TAU);
        context.stroke();
      }

      const finalPulse = reducedMotion ? .82 : .68 + Math.sin(time * .00125) * .16;
      drawEnergyStar(hub.x, hub.y, 1.6, "#cdb8ff", signalReveal * finalPulse * .42);

      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
      context.restore();
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      ratio = Math.min(window.devicePixelRatio || 1, compactLayout ? 1.25 : 1.5);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      draw(progress, performance.now());
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / Math.max(1, rect.width) - .5) * 2;
      const ny = ((event.clientY - rect.top) / Math.max(1, rect.height) - .5) * 2;
      pointerX += (nx * 3.5 - pointerX) * .2;
      pointerY += (ny * 3.5 - pointerY) * .2;
    };

    const animate = (time: number) => {
      if (time - lastRenderedAt < frameInterval) {
        if (visible) frame = window.requestAnimationFrame(animate);
        return;
      }
      lastRenderedAt = time;
      const intro = clamp((time - startTime) / 3100);
      draw(intro, time);
      if (visible) frame = window.requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      window.cancelAnimationFrame(frame);
      frame = 0;

      if (!visible) return;

      if (reducedMotion) {
        draw(1);
        return;
      }

      if (!started) {
        started = true;
        startTime = performance.now();
      }

      frame = window.requestAnimationFrame(animate);
    }, { threshold: .22 });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    observer.observe(canvas);
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    resize();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div
      className="dna-helix-visual"
      role="img"
      aria-label="Flujo tecnológico tridimensional formado por miles de partículas entrelazadas"
    >
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}

type MethodParticle = {
  target: number;
  origin: number;
  scatter: number;
  drift: number;
  size: number;
  delay: number;
  shape: number;
  color: string;
};

function MethodParticleTrack() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let seed = 314159;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const palette = ["#a487ff", "#e5bd73", "#75d9bd", "#82a8ff"];
    const particles: MethodParticle[] = Array.from({ length: 280 }, (_, index) => {
      const target = clamp((index + random() * 1.8) / 281, 0, 1);
      return {
        target,
        origin: random(),
        scatter: random() * 2 - 1,
        drift: random() * 2 - 1,
        size: .7 + random() * 1.15,
        delay: target * .58 + random() * .1,
        shape: index % 11 < 5 ? 0 : index % 11 < 8 ? 1 : index % 11 < 10 ? 2 : 3,
        color: palette[Math.min(3, Math.floor(target * 4))],
      };
    });

    let width = 0, height = 0, frame = 0, startTime = 0;
    let started = false, complete = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const drawGlyph = (particle: MethodParticle, x: number, y: number, alpha: number) => {
      const size = particle.size;
      context.globalAlpha = alpha;
      context.strokeStyle = particle.color;
      context.fillStyle = particle.color;
      context.lineWidth = .75;
      context.beginPath();
      if (particle.shape === 0) {
        context.arc(x, y, size * .62, 0, TAU);
        context.fill();
      } else if (particle.shape === 1) {
        context.rect(x - size * .65, y - size * .65, size * 1.3, size * 1.3);
        context.stroke();
      } else if (particle.shape === 2) {
        context.moveTo(x, y - size * .8);
        context.lineTo(x - size * .75, y + size * .62);
        context.lineTo(x + size * .75, y + size * .62);
        context.closePath();
        context.stroke();
      } else {
        context.moveTo(x, y - size * .85);
        context.lineTo(x - size * .75, y);
        context.lineTo(x, y + size * .85);
        context.lineTo(x + size * .75, y);
        context.closePath();
        context.stroke();
      }
    };

    const draw = (progress: number) => {
      const vertical = height > width;
      const primarySize = vertical ? height : width;
      const crossSize = vertical ? width : height;
      const center = crossSize * .5;
      const padding = vertical ? 5 : 6;
      const usable = Math.max(1, primarySize - padding * 2);
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        const local = smoothstep(particle.delay, particle.delay + .3, progress);
        const targetPrimary = padding + particle.target * usable;
        const targetCross = center + particle.drift * 1.35;
        const originPrimary = padding + particle.origin * Math.min(vertical ? 36 : 64, usable * .16);
        const originCross = center + particle.scatter * crossSize * .42;
        const arc = Math.sin(local * Math.PI) * particle.drift * Math.min(18, crossSize * .24);
        const primary = originPrimary + (targetPrimary - originPrimary) * local;
        const cross = originCross + (targetCross - originCross) * local + arc;
        const alpha = local < .02 ? .08 : .28 + local * .63;
        drawGlyph(particle, vertical ? cross : primary, vertical ? primary : cross, alpha);
      }
      context.globalAlpha = 1;
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(complete || reducedMotion ? 1 : 0);
    };

    const animate = (time: number) => {
      const progress = clamp((time - startTime) / 3100);
      draw(progress);
      if (progress < 1) frame = window.requestAnimationFrame(animate);
      else complete = true;
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      if (reducedMotion) { complete = true; draw(1); return; }
      startTime = performance.now();
      frame = window.requestAnimationFrame(animate);
    }, { threshold: .25 });
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    observer.observe(canvas);
    resize();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return <div className="method-track" aria-hidden="true"><canvas ref={canvasRef} /></div>;
}

interface ServiceData {
  id: string;
  index: string;
  title: string;
  overline: string;
  description: string;
  longDescription: string;
  features: string[];
  tags: string[];
  colorClass: string;
  icon: React.ReactNode;
}

const SERVICES_DATA: ServiceData[] = [
  {
    id: "ia",
    index: "01 / 03",
    title: "Inteligencia artificial",
    overline: "SISTEMAS QUE APRENDEN",
    description: "Integración de sistemas, creación de IA a medida, registro de actividad y análisis de Big Data.",
    longDescription: "Diseñamos e integramos soluciones cognitivas avanzadas que permiten a tu negocio automatizar la toma de decisiones complejas, automatizar procesos intelectuales y extraer valor de fuentes masivas de datos.",
    features: [
      "Integración de sistemas inteligentes (APIs, LLMs, modelos abiertos)",
      "Creación de modelos de Inteligencia Artificial entrenados a medida",
      "Registro de actividad inteligente y auditoría de decisiones automáticas",
      "Procesamiento y arquitectura de Big Data para análisis avanzado",
      "Modelos predictivos aplicados a operaciones y comportamiento de usuario"
    ],
    tags: ["Machine learning", "IA a medida", "Big Data", "Integración"],
    colorClass: "violet",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="5" r="2.25" />
        <circle cx="6" cy="17" r="2.25" />
        <circle cx="18" cy="17" r="2.25" />
        <path d="M10.9 7 7.1 15M13.1 7l3.8 8M8.3 17h7.4" />
      </svg>
    )
  },
  {
    id: "auto",
    index: "02 / 03",
    title: "Automatización de procesos",
    overline: "MENOS FRICCIÓN",
    description: "Informes automáticos, volcado inteligente de datos y optimización de operaciones empresariales.",
    longDescription: "Eliminamos las tareas repetitivas y propensas a errores humanos mediante flujos de trabajo inteligentes y automatizados que conectan tus herramientas y operan de forma autónoma las 24 horas del día.",
    features: [
      "Generación y envío automatizado de informes interactivos y PDFs",
      "Sincronización y volcado automático de datos entre múltiples plataformas",
      "Optimización de flujos operativos y reducción de tiempos de respuesta",
      "Integración fluida de sistemas heredados con APIs modernas",
      "Alertas proactivas y control automático de excepciones"
    ],
    tags: ["Workflows", "Informes automáticos", "Optimización", "Integraciones"],
    colorClass: "gold",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M7.2 7.7A6.5 6.5 0 0 1 18.5 12" />
        <path d="m15.8 9.4 2.8 2.8 2.7-2.8M16.8 16.3A6.5 6.5 0 0 1 5.5 12" />
        <path d="m8.2 14.6-2.8-2.8-2.7 2.8" />
      </svg>
    )
  },
  {
    id: "software",
    index: "03 / 03",
    title: "Software a medida",
    overline: "CREADO PARA TI",
    description: "Desarrollo completo de aplicaciones web y móviles adaptadas a tu negocio.",
    longDescription: "Construimos plataformas digitales robustas, escalables y visualmente impactantes diseñadas para ajustarse exactamente a la operativa y necesidades de tu empresa, garantizando la máxima autonomía.",
    features: [
      "Desarrollo de aplicaciones web progresivas de alto rendimiento (PWA)",
      "Aplicaciones móviles nativas e híbridas de última generación",
      "Arquitecturas de backend y base de datos robustas y seguras",
      "Despliegues en la nube flexibles y escalables (AWS, GCP, Vercel)",
      "Interfaces de usuario (UI/UX) premium con micro-animaciones fluidas"
    ],
    tags: ["Apps web y móviles", "APIs y Cloud", "Full stack", "UI/UX Premium"],
    colorClass: "teal",
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <path d="M3 8.5h18M8.5 13l-2 2 2 2M15.5 13l2 2-2 2M13 12l-2 6" />
      </svg>
    )
  }
];

interface FAQItem {
  id: number;
  topic: string;
  question: string;
  iconName: "dollar" | "tasks" | "globe" | "chart" | "headset";
  paragraphs: string[];
  listItems?: string[];
  quote?: {
    text: string;
    author: string;
  };
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    topic: "precios",
    question: "¿La Inteligencia Artificial es muy cara o complicada para mi negocio?",
    iconName: "dollar",
    paragraphs: [
      "¡Para nada! Nuestra misión es hacer la IA accesible y sencilla para todos. Nos adaptamos a tu presupuesto y creamos soluciones que no requieren conocimientos técnicos por tu parte.",
      "Nos encargamos de toda la complejidad para que tú solo disfrutes de los beneficios: más tiempo y más eficiencia."
    ]
  },
  {
    id: 2,
    topic: "integracion",
    question: "¿En qué tareas concretas me puede ayudar la automatización?",
    iconName: "tasks",
    paragraphs: [
      "Imagina no tener que volver a gestionar citas manualmente, responder las mismas preguntas en WhatsApp una y otra vez, o actualizar tu inventario a mano. Automatizamos tareas como:",
      "Básicamente, liberamos horas de tu semana para que te dediques a hacer crecer tu negocio."
    ],
    listItems: [
      "Atención al cliente con chatbots 24/7.",
      "Gestión automática de tu agenda y citas.",
      "Envío de correos de seguimiento o recordatorios.",
      "Procesamiento de pedidos y facturas."
    ]
  },
  {
    id: 3,
    topic: "general",
    question: "Ya uso redes sociales, ¿realmente necesito una página web?",
    iconName: "globe",
    paragraphs: [
      "Las redes sociales son geniales para interactuar, pero una página web es tu propia casa digital. Es el único lugar donde tienes el control total, proyectas una imagen 100% profesional y generas mucha más confianza.",
      "Además, una web te permite implementar herramientas de venta y análisis mucho más potentes. Piensa en ella como tu mejor vendedor, trabajando para ti 24 horas al día, 7 días a la semana."
    ]
  },
  {
    id: 4,
    topic: "general",
    question: "¿Cuánto tiempo tardaré en ver los resultados?",
    iconName: "chart",
    paragraphs: [
      "El impacto varía según la solución, pero muchos de nuestros clientes notan los beneficios desde la primera semana. El ahorro de tiempo con tareas automatizadas es inmediato.",
      "El aumento de clientes a través de una nueva web puede tomar algunas semanas mientras los buscadores la indexan, pero desde el primer día tendrás una herramienta profesional para dirigir a tus clientes. Te guiaremos en todo momento para maximizar el retorno de tu inversión lo antes posible."
    ]
  },
  {
    id: 5,
    topic: "soporte",
    question: "¿Qué pasa si algo no funciona o necesito ayuda después del lanzamiento?",
    iconName: "headset",
    paragraphs: [
      "Nuestra relación no termina con la entrega del proyecto. Consideramos a nuestros clientes como socios a largo plazo.",
      "Ofrecemos soporte continuo para resolver cualquier duda o incidencia. Tu tranquilidad es nuestra máxima prioridad, y estamos a solo un mensaje o una llamada de distancia para ayudarte en lo que necesites."
    ],
    quote: {
      text: "No solo construimos una solución, construimos una relación de confianza. Estamos aquí para asegurar tu éxito continuo.",
      author: "El equipo de LYXIA"
    }
  }
];

type ContactFormPayload = {
  requestId: string;
  name: string;
  email: string;
  company: string;
  interest: string;
  message: string;
  website: string;
};

type ContactFormStatus = "idle" | "submitting" | "success" | "error";

const sendContactRequest = httpsCallable<ContactFormPayload, { ok: boolean }>(
  firebaseFunctions,
  "submitContactRequest",
);

const createRequestId = () => {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const value = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
};

const renderFaqIcon = (iconName: string) => {
  switch (iconName) {
    case "dollar":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      );
    case "tasks":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          <polyline points="9 11 12 14 22 4"></polyline>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
      );
    case "globe":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      );
    case "headset":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
        </svg>
      );
    default:
      return null;
  }
};

export default function Home() {
  const progress = useRef(0), journeyRef = useRef<HTMLElement>(null);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [faqTopic, setFaqTopic] = useState("all");
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [contactFormStatus, setContactFormStatus] = useState<ContactFormStatus>("idle");
  const [contactFormFeedback, setContactFormFeedback] = useState(
    "Tus datos se utilizarán únicamente para responder a tu solicitud.",
  );
  const contactRequestId = useRef(createRequestId());

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter(item => faqTopic === "all" || item.topic === faqTopic);
  }, [faqTopic]);

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (contactFormStatus === "submitting") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const getValue = (name: string) => String(formData.get(name) ?? "");

    setContactFormStatus("submitting");
    setContactFormFeedback("Enviando tu solicitud de forma segura…");

    try {
      const response = await sendContactRequest({
        requestId: contactRequestId.current,
        name: getValue("name"),
        email: getValue("email"),
        company: getValue("company"),
        interest: getValue("interest"),
        message: getValue("message"),
        website: getValue("website"),
      });

      if (!response.data.ok) throw new Error("La solicitud no se ha podido completar.");

      form.reset();
      contactRequestId.current = createRequestId();
      setContactFormStatus("success");
      setContactFormFeedback(
        "Mensaje recibido. Te hemos enviado una confirmación y te responderemos lo antes posible.",
      );
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error
        ? String(error.code)
        : "";

      setContactFormStatus("error");
      if (code.includes("resource-exhausted")) {
        setContactFormFeedback("Has enviado varias solicitudes. Espera unos minutos y vuelve a intentarlo.");
      } else if (code.includes("aborted")) {
        setContactFormFeedback("Tu solicitud ya se está procesando. Espera unos segundos antes de reintentar.");
      } else {
        setContactFormFeedback("No hemos podido enviar el mensaje. Conservamos los datos para que puedas reintentarlo.");
      }
    }
  };


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedService(null);
        setIsContactModalOpen(false);
      }
    };
    if (selectedService || isContactModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedService, isContactModalOpen]);

  useEffect(() => {
    if (!isContactModalOpen) {
      contactRequestId.current = createRequestId();
      setContactFormStatus("idle");
      setContactFormFeedback("Tus datos se utilizarán únicamente para responder a tu solicitud.");
    }
  }, [isContactModalOpen]);

  const opacity = (start: number, end: number) => clamp(Math.min((displayProgress - start) / 9, (end - displayProgress) / 9));
  const firstExit = linearstep(16, 30, displayProgress);
  const worldVisibility = opacity(33, 72);
  const worldEntry = linearstep(33, 42, displayProgress);
  const firstChapterStyle = {
    opacity: 1 - firstExit,
    "--chapter-shift-x": `${-22 * firstExit}px`,
    "--chapter-blur": `${1.5 * firstExit}px`,
  } as CSSProperties;
  const worldChapterStyle = {
    opacity: worldVisibility,
    pointerEvents: "none",
    "--chapter-shift-x": `${28 * (1 - worldEntry)}px`,
    "--chapter-blur": `${1.5 * (1 - worldEntry)}px`,
  } as CSSProperties;
  const jumpToStage = (stage: number) => {
    const journey = journeyRef.current;
    if (!journey) return;
    const top = journey.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + Math.max(0, journey.offsetHeight - window.innerHeight) * stage, behavior: "smooth" });
  };
  useEffect(() => {
    let frame = 0, target = 0, lastDisplay = -1, journeyTop = 0, scrollDistance = 1;

    const animate = () => {
      frame = 0;
      const delta = target - progress.current;
      progress.current = Math.abs(delta) < .0005
        ? target
        : progress.current + delta * .14;

      const currentDisplay = Math.round(progress.current * 100);
      if (currentDisplay !== lastDisplay) {
        lastDisplay = currentDisplay;
        setDisplayProgress(currentDisplay);
      }

      if (Math.abs(target - progress.current) >= .0005) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    const scheduleUpdate = () => {
      target = clamp((window.scrollY - journeyTop) / scrollDistance);
      if (!frame) frame = window.requestAnimationFrame(animate);
    };

    const measureJourney = () => {
      const section = journeyRef.current;
      if (!section) return;
      journeyTop = section.getBoundingClientRect().top + window.scrollY;
      scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight);
      scheduleUpdate();
    };

    measureJourney();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", measureJourney, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", measureJourney);
    };
  }, []);
  return <main>
    <header className={`site-header ${displayProgress > 97 ? "site-header-solid" : ""} ${isMobileMenuOpen ? "site-header-expanded" : ""}`}>
      <div className="header-left">
        <a className="brand brand-icon" href="#inicio" aria-label="LYXIA, inicio" onClick={() => setIsMobileMenuOpen(false)}>
          <img src={logoIcono} alt="" aria-hidden="true" />
        </a>
        <nav className="header-nav" aria-label="Navegación principal">
          <a href="#vision">Quiénes somos</a>
          <a href="#capacidades">Capacidades</a>
          <a href="#preguntas-frecuentes">FAQ</a>
        </nav>
      </div>
      <div className="header-center">
        <span className="brand-text">LYXIA</span>
      </div>
      <div className="header-right">
        <a href="#contacto" className="header-cta" onClick={(e) => { e.preventDefault(); setIsContactModalOpen(true); }}>Hablemos <span>↗</span></a>
        <button
          type="button"
          className={`hamburger-btn ${isMobileMenuOpen ? "active" : ""}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Abrir menú de navegación"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="mobile-nav-panel">
          <a href="#vision" onClick={() => setIsMobileMenuOpen(false)}>Quiénes somos</a>
          <a href="#capacidades" onClick={() => setIsMobileMenuOpen(false)}>Capacidades</a>
          <a href="#preguntas-frecuentes" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
          <a href="#contacto" className="mobile-nav-cta" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); setIsContactModalOpen(true); }}>Hablemos ↗</a>
        </div>
      )}
    </header>
    <section id="inicio" ref={journeyRef} className="journey" aria-label="Viaje inmersivo del cerebro al mundo y la expansión de la inteligencia"><div className="journey-sticky"><NeuralCanvas progress={progress} /><div className="journey-vignette journey-vignette-left" style={{ opacity: 1 - worldVisibility }} /><div className="journey-vignette journey-vignette-right" style={{ opacity: worldVisibility }} />
      <div className="chapter chapter-first" style={firstChapterStyle}><span className="eyebrow"><span /> Inteligencia aplicada · Valencia</span><h1>La inteligencia<br />que mueve<br /><span className="text-gradient">tu empresa.</span></h1><p>Convertimos procesos complejos en sistemas que piensan, aprenden y evolucionan contigo.</p><a className="inline-link" href="#vision">Descubre cómo <span>↗</span></a></div>
      <div className="chapter chapter-right chapter-world" style={worldChapterStyle}><span className="chapter-number">02 / UN MUNDO CONECTADO</span><h2>La inteligencia<br />que mueve<br /><span className="text-gold">el mundo.</span></h2><p>Conectamos ideas, datos y personas para transformar la forma en que las empresas avanzan.</p></div>
      <div className="chapter chapter-center" style={{ opacity: opacity(67, 109), pointerEvents: "none" }}><span className="chapter-number">03 / SIN LÍMITES</span><h2>La tecnología<br />que se adapta<br /><span className="text-gradient">a ti.</span></h2><p>Construimos inteligencia a medida, preparada para evolucionar al ritmo de tu empresa.</p></div>
      <div className="stage-navigation" aria-label="Etapas del recorrido">{[0, .5, 1].map((stage, index) => { const active = Math.abs(displayProgress / 100 - stage) < .22; return <button key={stage} type="button" aria-label={index === 2 ? "Ir al final de la introducción" : `Ir a la etapa ${index + 1}`} aria-current={active ? "step" : undefined} className={active ? "stage-active" : ""} onClick={() => jumpToStage(stage)} />; })}</div>
      <div className="journey-bottom"><span className="scroll-prompt"><span /> Desliza para explorar</span><div className="progress-indicator"><span>{String(displayProgress).padStart(2, "0")}</span><i><b style={{ width: `${displayProgress}%` }} /></i><span>100</span></div><span className="system-status">SISTEMA ACTIVO <span /></span></div>
    </div></section>
    <section id="vision" className="vision-section">
      <div className="section-kicker"><span>01</span> QUIÉNES SOMOS</div>
      <div className="vision-container">
        <div className="vision-content">
          <h2>El futuro no se predice.<br /><span>Se construye.</span></h2>

          <p className="vision-intro">
            <strong>LYXIA</strong> es una empresa tecnológica especializada en digitalización, automatización e inteligencia artificial. Diseñamos soluciones a medida que conectan software, datos, APIs y modelos de IA para transformar procesos empresariales en sistemas más rápidos, eficientes y escalables.
          </p>

          <p className="vision-text">
            Nace de la experiencia desarrollando soluciones que combinan inteligencia artificial, ingeniería de software, automatización y sistemas inteligentes. Desde plataformas empresariales y APIs hasta modelos de redes neuronales y sistemas predictivos, nuestra experiencia técnica nos permite abordar todo el ciclo de una solución tecnológica.
          </p>

        </div>

        <div className="vision-visual">
          <img
            className="vision-static-image"
            src={visionImage}
            width={1086}
            height={1448}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            alt="Red luminosa de datos e inteligencia artificial conectada"
          />
        </div>
      </div>
      <div className="vision-metrics">
        <div><strong>100%</strong><span>Soluciones a medida</span></div>
        <div><strong>∞</strong><span>Capacidad de evolución</span></div>
        <div><strong>01</strong><span>Objetivo: tu crecimiento</span></div>
      </div>
    </section>
    <section id="capacidades" className="capabilities-section">
      <div className="capabilities-aura" aria-hidden="true" />
      <div className="section-kicker"><span>02</span> LO QUE HACEMOS</div>
      <div className="section-heading">
        <h2>Tecnología con<br /><span>propósito.</span></h2>
        <div className="section-heading-copy">
          <span>DE LA IDEA AL IMPACTO</span>
          <p>Unimos estrategia, ingeniería y diseño para convertir retos complejos en ventajas reales.</p>
        </div>
      </div>
      <div className="capability-grid">
        {SERVICES_DATA.map((service) => (
          <article
            key={service.id}
            className={`capability-card capability-card-${service.colorClass}`}
            onClick={() => setSelectedService(service)}
            style={{ cursor: "pointer" }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedService(service);
              }
            }}
          >
            <div className="card-top">
              <span className="card-icon" aria-hidden="true">
                {service.icon}
              </span>
              <span className="card-index">{service.index}</span>
            </div>
            <div className="card-content">
              <span className="card-overline">{service.overline}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
            <div className="card-footer">
              <div className="card-tags">
                {service.tags.slice(0, 2).map((tag, i) => (
                  <span key={i}>{tag}</span>
                ))}
              </div>
              <span className="card-arrow" aria-hidden="true">↗</span>
            </div>
          </article>
        ))}
      </div>
    </section>
    <section id="metodo" className="method-section">
      <div className="method-header">
        <div>
          <div className="section-kicker"><span>03</span> MÉTODO LYXIA</div>
          <h2>Entender antes de<br /><span>automatizar.</span></h2>
        </div>
        <p>Cada proyecto empieza en el negocio, no en la tecnología. Medimos el problema, diseñamos la solución y comprobamos su impacto.</p>
      </div>
      <div className="method-flow">
        <MethodParticleTrack />
        <div className="method-grid">
          <article className="method-step">
            <div className="method-step-marker"><strong>01</strong><span /></div>
            <div className="method-step-content">
              <span className="method-step-label"><b className="step-num step-num-1">01</b> DESCUBRIR</span>
              <h3>Comprender</h3>
              <p>Mapeamos el proceso, las personas, las herramientas y los puntos de fricción.</p>
            </div>
          </article>
          <article className="method-step">
            <div className="method-step-marker"><strong>02</strong><span /></div>
            <div className="method-step-content">
              <span className="method-step-label"><b className="step-num step-num-2">02</b> DEFINIR</span>
              <h3>Diseñar</h3>
              <p>Definimos la solución, las integraciones y los indicadores que medirán el resultado.</p>
            </div>
          </article>
          <article className="method-step">
            <div className="method-step-marker"><strong>03</strong><span /></div>
            <div className="method-step-content">
              <span className="method-step-label"><b className="step-num step-num-3">03</b> CONSTRUIR</span>
              <h3>Implementar</h3>
              <p>Construimos, conectamos y desplegamos sin interrumpir la operativa existente.</p>
            </div>
          </article>
          <article className="method-step">
            <div className="method-step-marker"><strong>04</strong><span /></div>
            <div className="method-step-content">
              <span className="method-step-label"><b className="step-num step-num-4">04</b> EVOLUCIONAR</span>
              <h3>Optimizar</h3>
              <p>Medimos el uso real y evolucionamos el sistema a medida que crece el negocio.</p>
            </div>
          </article>
        </div>
      </div>
      <div className="method-principle">
        <span>PRINCIPIO 01</span>
        <p>La tecnología solo tiene valor cuando mejora una realidad.</p>
      </div>
    </section>
    <section id="contacto" className="contact-section">
      <div className="contact-orb" aria-hidden="true" />
      <span className="section-kicker"><span>04</span> EMPECEMOS</span>
      <h2>Tu próximo avance<br />empieza con una <span>conversación.</span></h2>
      <p>Cuéntanos qué te gustaría transformar. Nosotros encontraremos la manera.</p>
      <button type="button" className="contact-section-btn" onClick={() => setIsContactModalOpen(true)}>
        Hablemos de tu proyecto <span>↗</span>
      </button>
    </section>
    <section id="preguntas-frecuentes" className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <span className="section-kicker"><span>05</span> FAQ</span>
          <h2>Resolvemos tus <span>Dudas</span></h2>
          <p>Aquí tienes las respuestas a las preguntas más comunes. Si no encuentras la tuya, ¡contáctanos sin compromiso!</p>
        </div>
        <div className="faq-search">
          <div className="faq-topics">
            {[
              { id: "all", label: "Todos" },
              { id: "general", label: "General" },
              { id: "precios", label: "Precios" },
              { id: "integracion", label: "Soluciones" },
              { id: "soporte", label: "Soporte" }
            ].map(topic => (
              <button
                key={topic.id}
                type="button"
                className={`topic-btn ${faqTopic === topic.id ? "active" : ""}`}
                onClick={() => setFaqTopic(topic.id)}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>
        <div className="faq-items">
          {filteredFAQs.map((item) => {
            const isActive = expandedFaqId === item.id;
            return (
              <div key={item.id} className={`faq-item ${isActive ? "active" : ""}`}>
                <div
                  className="faq-question"
                  role="button"
                  aria-expanded={isActive}
                  onClick={() => setExpandedFaqId(isActive ? null : item.id)}
                >
                  <div className="question-icon">
                    {renderFaqIcon(item.iconName)}
                  </div>
                  <div className="question-text">
                    <h3>{item.question}</h3>
                  </div>
                  <div className="question-toggle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="chevron-icon" width="16" height="16">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
                {isActive && (
                  <div className="faq-answer">
                    {item.paragraphs.map((p, idx) => (
                      <p key={idx} dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    ))}
                    {item.listItems && (
                      <ul>
                        {item.listItems.map((li, idx) => (
                          <li key={idx}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="check-icon" width="12" height="12" style={{ marginRight: '8px', color: '#73d2c3', display: 'inline-block', verticalAlign: 'middle' }}>
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            {li}
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.quote && (
                      <div className="answer-quote">
                        <blockquote>"{item.quote.text}"</blockquote>
                        <cite>{item.quote.author}</cite>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="faq-footer">
          <p>¿No encuentras la respuesta que buscas?</p>
          <div className="footer-actions">
            <button type="button" className="faq-contact-btn" onClick={() => setIsContactModalOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Hablemos de tu caso <span>↗</span>
            </button>
          </div>
        </div>
      </div>
    </section>
    <footer className="site-footer"><a className="brand brand-footer" href="#inicio" aria-label="LYXIA Technology, volver al inicio"><img src={logoVertical} alt="" aria-hidden="true" /></a><span>Inteligencia artificial con propósito.</span><span>VALENCIA · ESPAÑA</span></footer>

    {selectedService && (
      <div
        className="service-modal-backdrop"
        onClick={() => setSelectedService(null)}
      >
        <div
          className={`service-modal-content service-modal-${selectedService.colorClass}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="service-modal-close"
            onClick={() => setSelectedService(null)}
            aria-label="Cerrar modal"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="modal-header">
            <span className="modal-index">{selectedService.index}</span>
            <span className="modal-overline">{selectedService.overline}</span>
            <h2>{selectedService.title}</h2>
          </div>

          <div className="modal-body">
            <p className="modal-desc">{selectedService.longDescription}</p>

            <div className="modal-features-section">
              <h4>¿QUÉ INCLUYE ESTE SERVICIO?</h4>
              <ul className="modal-features-list">
                {selectedService.features.map((feature, i) => (
                  <li key={i}>
                    <span className="bullet-point" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="modal-footer">
            <div className="modal-tags">
              {selectedService.tags.map((tag, i) => (
                <span key={i}>{tag}</span>
              ))}
            </div>
            <a
              href="#contacto"
              className="modal-cta"
              onClick={(e) => {
                e.preventDefault();
                setSelectedService(null);
                setTimeout(() => {
                  setIsContactModalOpen(true);
                }, 100);
              }}
            >
              Hablemos de tu proyecto <span>↗</span>
            </a>
          </div>
        </div>
      </div>
    )}

    {isContactModalOpen && (
      <div
        className="service-modal-backdrop"
        onClick={() => setIsContactModalOpen(false)}
      >
        <div
          className="service-modal-content service-modal-violet"
          style={{ maxWidth: "800px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="service-modal-close"
            onClick={() => setIsContactModalOpen(false)}
            aria-label="Cerrar modal"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="contact-form-intro" style={{ marginTop: "12px" }}>
            <div>
              <span className="section-kicker"><span>06</span> TU PROYECTO</span>
              <h3 id="contact-form-title" style={{ fontSize: "clamp(32px, 4vw, 48px)", marginTop: 0 }}>Hablemos de lo<br />que viene.</h3>
            </div>
            <p>Unas pocas líneas son suficientes para empezar. Cuéntanos el reto y te ayudaremos a convertirlo en una oportunidad real.</p>
          </div>
          <form
            className="contact-form"
            style={{ marginTop: "32px" }}
            onSubmit={handleContactSubmit}
            aria-busy={contactFormStatus === "submitting"}
          >
            <label className="contact-website-field" aria-hidden="true">
              No rellenar este campo
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
            <div className="contact-form-heading">
              <span><i /> CANAL DIRECTO</span>
              <strong>RESPUESTA PERSONALIZADA</strong>
            </div>
            <div className="form-row">
              <label>
                <span><b>01</b> Nombre</span>
                <input type="text" name="name" placeholder="Tu nombre" autoComplete="name" maxLength={100} required />
              </label>
              <label>
                <span><b>02</b> Email</span>
                <input type="email" name="email" placeholder="nombre@empresa.com" autoComplete="email" maxLength={254} required />
              </label>
            </div>
            <div className="form-row">
              <label>
                <span><b>03</b> Empresa <i>Opcional</i></span>
                <input type="text" name="company" placeholder="Nombre de tu empresa" autoComplete="organization" maxLength={150} />
              </label>
              <label>
                <span><b>04</b> Área de interés</span>
                <select name="interest" defaultValue="" required>
                  <option value="" disabled>Selecciona una opción</option>
                  <option value="automation">Automatización inteligente</option>
                  <option value="data">Datos y analítica</option>
                  <option value="ai">Inteligencia artificial</option>
                  <option value="custom">Solución a medida</option>
                </select>
              </label>
            </div>
            <label className="form-message">
              <span><b>05</b> ¿Qué te gustaría transformar?</span>
              <textarea name="message" rows={4} maxLength={3000} placeholder="Háblanos brevemente de tu proyecto, reto u objetivo..." required />
            </label>
            <div className="contact-form-footer">
              <small
                id="contact-form-status"
                className={`contact-form-status contact-form-status-${contactFormStatus}`}
                role={contactFormStatus === "error" ? "alert" : "status"}
                aria-live="polite"
              >
                {contactFormFeedback}
              </small>
              <button
                type="submit"
                disabled={contactFormStatus === "submitting"}
                aria-describedby="contact-form-status"
              >
                {contactFormStatus === "submitting"
                  ? "Enviando…"
                  : contactFormStatus === "success"
                    ? "Enviar otro mensaje"
                    : "Enviar mensaje"}
                <span>{contactFormStatus === "submitting" ? "·" : "↗"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </main>;
}
