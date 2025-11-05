// src/app/api/og/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
// export const contentType = "image/png";
// export const size = { width: 1200, height: 630 };

function gradientForLP(lp: string): string {
  const map: Record<string, string> = {
    "1": "linear-gradient(135deg,#fff1f2,#fee2e2,#ffe4e6)",      // розово-красные
    "2": "linear-gradient(135deg,#eff6ff,#e0f2fe,#dbeafe)",      // холодные синие
    "3": "linear-gradient(135deg,#fef9c3,#fde68a,#fef08a)",      // солнечные
    "4": "linear-gradient(135deg,#f1f5f9,#e2e8f0,#e5e7eb)",      // нейтрально-серые
    "5": "linear-gradient(135deg,#ecfeff,#cffafe,#a7f3d0)",      // бирюза/зелёный
    "6": "linear-gradient(135deg,#fdf2f8,#fae8ff,#fce7f3)",      // нежные розово-лиловые
    "7": "linear-gradient(135deg,#ede9fe,#e9d5ff,#ddd6fe)",      // фиолетовые
    "8": "linear-gradient(135deg,#f0fdf4,#dcfce7,#bbf7d0)",      // зелёные
    "9": "linear-gradient(135deg,#fef2f2,#fee2e2,#fef3c7)",      // тёплые огненно-медовые
    "11": "linear-gradient(135deg,#e0e7ff,#f5f3ff,#e9d5ff)",     // мистический сине-лиловый
    "22": "linear-gradient(135deg,#e2e8f0,#cbd5e1,#f1f5f9)"      // архитектурно-спокойный
  };
  return map[lp] || "linear-gradient(135deg,#eef2ff,#f8fafc,#f5f3ff)";
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name  = searchParams.get("name")  || "Myself on Metro";
    const lp    = searchParams.get("lp")    || "-";
    const phys  = searchParams.get("phys")  || "0.00";
    const emo   = searchParams.get("emo")   || "0.00";
    const intel = searchParams.get("intel") || "0.00";
    const bg = gradientForLP(lp);


    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "40px",
            background: bg,
            fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI"
          }}
        >
          {/* Header */}
          <div style={{ display: "flex" }}>
            <div style={{ fontSize: 40, fontWeight: 900, color: "#3730a3", letterSpacing: -0.5 }}>
              Myself on Metro
            </div>
          </div>
    
          {/* Two columns that reflow nicely */}
          <div style={{ display: "flex", gap: 40 }}>
            {/* Left */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex" }}>
                <div style={{ fontSize: 26, color: "#111827" }}>Имя</div>
              </div>
              <div
                style={{
                  display: "flex",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  // авто-масштаб имени
                  fontSize: name.length > 18 ? 34 : name.length > 10 ? 40 : 48,
                  wordBreak: "break-word",
                  overflow: "hidden"
                }}
              >
                {name}
              </div>
    
              <div style={{ display: "flex", marginTop: 10 }}>
                <div style={{ fontSize: 26, color: "#111827" }}>Life Path</div>
              </div>
              <div style={{ display: "flex" }}>
                <div style={{ fontSize: 68, fontWeight: 900, lineHeight: 1 }}>{lp}</div>
              </div>
            </div>
    
            {/* Right */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex" }}>
                <div style={{ fontSize: 26, color: "#111827" }}>Биоритмы (сегодня)</div>
              </div>
    
              {[
                ["Физический:", phys],
                ["Эмоциональный:", emo],
                ["Интеллектуальный:", intel]
              ].map(([label, val], i) => (
                <div key={i} style={{ display: "flex", gap: 8, fontSize: 22, alignItems: "baseline" }}>
                  <span>{label as string}</span>
                  <b>{val as string}</b>
                </div>
              ))}
            </div>
          </div>
    
          {/* Footer */}
          <div style={{ display: "flex" }}>
            <div style={{ fontSize: 18, color: "#4b5563" }}>mirror • ego-snack • subway-friendly</div>
          </div>
        </div>
      ),
      // { ...size }
    );    
  } catch (err) {
    return new Response(`OG error: ${(err as Error).message}`, { status: 500 });
  }
}
// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const name  = searchParams.get("name")  || "Myself on Metro";
//     const lp    = searchParams.get("lp")    || "-";
//     const phys  = searchParams.get("phys")  || "0.00";
//     const emo   = searchParams.get("emo")   || "0.00";
//     const intel = searchParams.get("intel") || "0.00";
//     const bg = gradientForLP(lp);


//     return new ImageResponse(
//       (
//         <div
//           style={{
//             width: `${size.width}px`,
//             height: `${size.height}px`,
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-between",
//             padding: "40px",
//             background: bg,
//             fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI"
//           }}
//         >
//           {/* Header */}
//           <div style={{ display: "flex" }}>
//             <div style={{ fontSize: 40, fontWeight: 900, color: "#3730a3", letterSpacing: -0.5 }}>
//               Myself on Metro
//             </div>
//           </div>
    
//           {/* Two columns that reflow nicely */}
//           <div style={{ display: "flex", gap: 40 }}>
//             {/* Left */}
//             <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, minWidth: 0 }}>
//               <div style={{ display: "flex" }}>
//                 <div style={{ fontSize: 26, color: "#111827" }}>Имя</div>
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   fontWeight: 800,
//                   lineHeight: 1.1,
//                   // авто-масштаб имени
//                   fontSize: name.length > 18 ? 34 : name.length > 10 ? 40 : 48,
//                   wordBreak: "break-word",
//                   overflow: "hidden"
//                 }}
//               >
//                 {name}
//               </div>
    
//               <div style={{ display: "flex", marginTop: 10 }}>
//                 <div style={{ fontSize: 26, color: "#111827" }}>Life Path</div>
//               </div>
//               <div style={{ display: "flex" }}>
//                 <div style={{ fontSize: 68, fontWeight: 900, lineHeight: 1 }}>{lp}</div>
//               </div>
//             </div>
    
//             {/* Right */}
//             <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, minWidth: 0 }}>
//               <div style={{ display: "flex" }}>
//                 <div style={{ fontSize: 26, color: "#111827" }}>Биоритмы (сегодня)</div>
//               </div>
    
//               {[
//                 ["Физический:", phys],
//                 ["Эмоциональный:", emo],
//                 ["Интеллектуальный:", intel]
//               ].map(([label, val], i) => (
//                 <div key={i} style={{ display: "flex", gap: 8, fontSize: 22, alignItems: "baseline" }}>
//                   <span>{label as string}</span>
//                   <b>{val as string}</b>
//                 </div>
//               ))}
//             </div>
//           </div>
    
//           {/* Footer */}
//           <div style={{ display: "flex" }}>
//             <div style={{ fontSize: 18, color: "#4b5563" }}>mirror • ego-snack • subway-friendly</div>
//           </div>
//         </div>
//       ),
//       { ...size }
//     );    
//   } catch (err) {
//     return new Response(`OG error: ${(err as Error).message}`, { status: 500 });
//   }
// }
