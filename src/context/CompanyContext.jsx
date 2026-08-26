import React, { createContext, useContext, useState, useEffect } from "react";

const CompanyContext = createContext();

export const useCompany = () => {
  return useContext(CompanyContext);
};

export const CompanyProvider = ({ children }) => {
  const [activeCompanyId, setActiveCompanyId] = useState(
    localStorage.getItem("activeCompanyId") || ""
  );

  useEffect(() => {
    if (activeCompanyId) {
      localStorage.setItem("activeCompanyId", activeCompanyId);
    } else {
      localStorage.removeItem("activeCompanyId");
    }
  }, [activeCompanyId]);

  return (
    <CompanyContext.Provider value={{ activeCompanyId, setActiveCompanyId }}>
      {children}
    </CompanyContext.Provider>
  );
};
