import { Request, Response } from "express";

export const getIp = async (req: Request, res: Response) => {
    try {
        const response = await fetch("https://api.ipify.org?format=json");
        if (!response.ok) {
            return res.status(502).json({ message: "Failed to fetch IP" });
        }
        const data = await response.json();
        res.json({ ip: data.ip });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
