import { Funko } from "../models/Funko.js";

/**
 * Tipo de operación que puede realizar el cliente.
 */
export type OperationType = 'add' | 'update' | 'remove' | 'read' | 'list';

/**
 * Estrcuturta de la petición que envía el cliente al servidor.
 */
export interface RequestType {
    type: OperationType;
    user: string;
    id?: number;
    funko?: Funko;
}

export interface ResponseType {
    type: OperationType;
    success: boolean;
    message: string;
    funkoPops?: Funko[]; // usado para 'list' o 'read'
}