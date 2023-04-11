export interface Node {
    id: number,
    name: string,
    parentId: number,
    height: number,
}

export interface Manager extends Node {
    departmentName: string,
}

export interface Employee extends Node {
    programmingLanguage: number,
}