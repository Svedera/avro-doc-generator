export class ViewGroup<T> {
    groupName: string | null;
    schemas: T[]

    constructor(
        groupName: string | null,
        schemas: T[]) {

        this.groupName = groupName;
        this.schemas = schemas;
    }
}

export class ItemWithIndex<T> {
    index: number;
    item: T

    constructor(
        index: number,
        item: T) {

        this.index = index;
        this.item = item;
    }
}
