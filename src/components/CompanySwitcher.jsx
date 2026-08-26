import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@mantine/core";
import { FaBuilding } from "react-icons/fa";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useCompany } from "../context/CompanyContext";

const CompanySwitcher = () => {
  const axiosPrivate = useAxiosPrivate();
  const { activeCompanyId, setActiveCompanyId } = useCompany();

  const { data: companiesData, isLoading } = useQuery({
    queryKey: ["companies-list"],
    queryFn: async () => {
      const res = await axiosPrivate.get("/companies");
      return res.data;
    },
  });

  // Automatically set activeCompanyId to the default company on first load if empty
  useEffect(() => {
    if (!activeCompanyId && companiesData?.data) {
      const defaultCompany = companiesData.data.find((c) => c.isDefault);
      if (defaultCompany) {
        setActiveCompanyId(defaultCompany._id);
      }
    }
  }, [companiesData, activeCompanyId, setActiveCompanyId]);

  if (isLoading) return <Loader size="xs" color="red" />;

  const companies = companiesData?.data || [];

  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5 border border-gray-200 dark:border-gray-700">
      <FaBuilding className="text-gray-500 dark:text-gray-400 w-4 h-4" />
      <select
        value={activeCompanyId}
        onChange={(e) => setActiveCompanyId(e.target.value)}
        className="bg-transparent border-none text-sm font-semibold text-gray-700 dark:text-gray-200 focus:ring-0 cursor-pointer w-24 sm:w-40 truncate outline-none p-0 sm:px-2"
      >
        <option value="">Select Company</option>
        {companies.map((company) => (
          <option key={company._id} value={company._id} className="dark:bg-gray-800">
            {company.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CompanySwitcher;
