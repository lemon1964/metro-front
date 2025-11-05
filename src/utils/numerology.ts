// metro-front/src/utils/numerology.ts
// Простейшие открытые трактовки для Life Path и числа имени.
// Таблицы можно расширять в zGPT5 (JSON/MD) и подключать отсюда.

const LIFE_PATH_TEXT: Record<string, string> = {
    "1": "Лидерство, инициатива. Делай первый шаг — день любит решительность.",
    "2": "Тактичность, партнёрство. Слушай и увязывай интересы.",
    "3": "Творчество и лёгкость. Пиши, рисуй, шути — идеи полетят.",
    "4": "Структура и опора. Порядок в делах даст спокойствие.",
    "5": "Движение и новизна. Маленькое приключение оживит день.",
    "6": "Забота и красота. Семья, дом, уют — в приоритете.",
    "7": "Глубина и смысл. Размышляй, читай, будь наблюдателем.",
    "8": "Материя и власть. Договаривайся, считай, укрепляй позиции.",
    "9": "Служение и широта. Поделись, помоги — вернётся многократно.",
    "11": "Интуиция и вдохновение. Замечай знаки и тонкие намёки.",
    "22": "Большие конструкции из простого. Малый шаг к большой цели.",
  };
  
  const LETTER_MAP: Record<string, number> = {
    // EN (Pythagorean)
    a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,
    j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,
    s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8,
    // RU (приближение 1–9 по алфавиту, циклично)
    а:1,б:2,в:3,г:4,д:5,е:6,ё:7,ж:8,з:9,
    и:1,й:2,к:3,л:4,м:5,н:6,о:7,п:8,р:9,
    с:1,т:2,у:3,ф:4,х:5,ц:6,ч:7,ш:8,щ:9,
    ъ:1,ы:2,ь:3,э:4,ю:5,я:6,
  };
  
  function sumDigits(n: number): number {
    return n.toString().split("").reduce((a, d) => a + Number(d), 0);
  }
  
  export function lifePathFromDOB(dobISO: string): { value: string; text: string } {
    // YYYY-MM-DD
    const digits = dobISO.replaceAll("-", "").split("").map(Number);
    let s = digits.reduce((a, d) => a + d, 0);
    // сохраняем мастер-числа 11 и 22, иначе редуцируем до 1–9
    if (s !== 11 && s !== 22) {
      while (s > 9) s = sumDigits(s);
    }
    const key = String(s);
    return { value: key, text: LIFE_PATH_TEXT[key] ?? "Двигайся мягко и осознанно." };
  }
  
  export function nameNumber(nameRaw: string): { value: number; text: string } {
    const name = (nameRaw || "").toLowerCase().replace(/[^a-zа-яё]/gi, "");
    const total = name.split("").reduce((a, ch) => a + (LETTER_MAP[ch] ?? 0), 0);
    let reduced = total;
    if (reduced !== 11 && reduced !== 22) {
      while (reduced > 9) reduced = sumDigits(reduced);
    }
    const text = `Тон имени: ${reduced}. ${LIFE_PATH_TEXT[String(reduced)] ?? ""}`;
    return { value: reduced, text };
  }
  
  export function playfulNumberMeaning(n: number): string {
    if (Number.isNaN(n)) return "Выбери число — сыграем с его смыслом.";
    const m = n % 9 || 9;
    return `Число ${n}: резонанс «${m}». ${LIFE_PATH_TEXT[String(m)] ?? ""}`;
  }
  