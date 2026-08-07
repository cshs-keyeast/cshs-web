export function isWeekend(date?: Date | string) {
  let targetDate: Date;
  
  if (date) {
    if (typeof date === 'string' && /^\d{8}$/.test(date)) {
      // YYYYMMDD 형식을 YYYY-MM-DD로 변환
      const formatted = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
      targetDate = new Date(formatted);
    } else {
      targetDate = new Date(date);
    }
  } else {
    targetDate = new Date();
  }
  
  const day = targetDate.getDay();
  return day === 0 || day === 6; // 0: 일요일, 6: 토요일
};

export function formatPerioRange(perio: string, date: string): string {
  if (!perio) return "";
  const sorted = perio
    .split(',')
    .map((p: string) => parseInt(p.trim(), 10))
    .filter((n: number) => !isNaN(n))
    .sort((a: number, b: number) => a - b);
  if (sorted.length === 0) return "";
  const groups: number[][] = [];
  let currentGroup: number[] = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1] + 1) {
      currentGroup.push(sorted[i]);
    } else {
      groups.push(currentGroup);
      currentGroup = [sorted[i]];
    }
  }
  groups.push(currentGroup);
  return groups
    .map((group) => {
      if (group.length === 1) {
        return displayPerio(group[0], undefined, date);
      }
      const start = displayPerio(group[0], undefined, date);
      const end = displayPerio(group[group.length - 1], undefined, date);
      return `${start} ~ ${end}`;
    })
    .join(', ');
}

export default function displayPerio(perio:number, type?:number, date?:Date | string):string {
  if (isWeekend(date)) {
    // 주말: perio 1~4
    const weekendLabels = ['1교시', '2교시', '3교시', '4교시'];
    return weekendLabels[perio - 1] || '';
  } else {
    // 평일: perio 1~5
    let weekdayLabels = ['7교시', '8교시', '야자 1교시', '야자 2교시', '야자 3교시']; // type 1
    if(type === 2) weekdayLabels = ['7교시', '8교시', '야자 1', '야자 2', '야자 3']; // type 2
    if(type === 3) weekdayLabels = ['7교시', '8교시', '야1', '야2', '야3']; // type 3
    return weekdayLabels[perio - 1] || '';
  }
}
