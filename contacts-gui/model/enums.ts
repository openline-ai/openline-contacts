export function getEnumLabel(list: any, value: string): string {
    if(!value) return '';
    return list.filter((p: any) => p.value === value)[0].label;
}