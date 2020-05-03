export class Item {
    readonly name: string;
    readonly price: number;
    itemHash?: string;
    shared?: boolean;
}

export class Share {
    readonly id: number;
    readonly recipientId: number;
}

