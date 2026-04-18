import axiosInstance from "./axiosInstance";

export interface BlockchainRecord {
    blockchainId: number;
    transactionHash: string;
    tipoOperacion: string;
    cedulaCiudadano: string;
    metadataJson: string;
    fechaTransaccion: string;
}

export const fetchBlockchainRecords = async (): Promise<BlockchainRecord[]> => {
    const response = await axiosInstance.get("/Blockchain");
    return response.data;
};

export const fetchBlockchainDetail = async (id: number): Promise<BlockchainRecord> => {
    const response = await axiosInstance.get(`/Blockchain/${id}`);
    return response.data;
};

export const registerBlockchainTransaction = async (data: any) => {
    return await axiosInstance.post("/Blockchain", data);
};
