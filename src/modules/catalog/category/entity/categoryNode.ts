export interface CategoryNode {
    id : number;
    name : string;
    level: number;
    parentId: number | null;
    children: CategoryNode[];
}