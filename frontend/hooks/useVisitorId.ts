"use client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid'; 

export const useVisitorId = () => {
  const [visitorId, setVisitorId] = useState<string>("");

  useEffect(() => {
    let id = localStorage.getItem("portfolio_visitor_id");
    
    if (!id) {
      id = uuidv4();
      localStorage.setItem("portfolio_visitor_id", id);
    }
    
    setVisitorId(id);
  }, []);

  return visitorId;
};