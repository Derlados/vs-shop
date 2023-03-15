export function transformFilters(attributes: string[]): Map<number, number[]> {
    const filters = new Map<number, number[]>();
    attributes.forEach(f => {
        if (!/(\d+-\d+)/.test(f)) {
            return;
        }

        const [attrId, value] = f.split('-').map(elem => Number(elem));
        if (!filters.has(attrId)) {
            filters.set(attrId, []);
        }

        filters.get(attrId).push(value);
    })

    return filters
}