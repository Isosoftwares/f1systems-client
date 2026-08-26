import { useMemo } from "react";
import countiesData from "./county.json"; // Adjust path as needed

const useLocations = () => {
  const processedData = useMemo(() => {
    if (!countiesData || !Array.isArray(countiesData)) {
      return {
        counties: [],
        constituencies: [],
        wards: [],
      };
    }

    // Extract counties
    const counties = countiesData.map((county) => ({
      code: county.county_code,
      name: county.county_name,
      id: county.county_code,
    }));

    // Extract constituencies with county reference
    const constituencies = [];
    countiesData.forEach((county) => {
      if (county.constituencies && Array.isArray(county.constituencies)) {
        county.constituencies.forEach((constituency) => {
          constituencies.push({
            name: constituency.constituency_name,
            county_code: county.county_code,
            county_name: county.county_name,
            id: `${county.county_code}-${constituency.constituency_name
              .replace(/\s+/g, "-")
              .toLowerCase()}`,
          });
        });
      }
    });

    // Extract wards with constituency and county reference
    const wards = [];
    countiesData.forEach((county) => {
      if (county.constituencies && Array.isArray(county.constituencies)) {
        county.constituencies.forEach((constituency) => {
          if (constituency.wards && Array.isArray(constituency.wards)) {
            constituency.wards.forEach((ward) => {
              wards.push({
                name: ward.trim(), // Clean up any extra spaces
                constituency_name: constituency.constituency_name,
                county_code: county.county_code,
                county_name: county.county_name,
                id: `${county.county_code}-${constituency.constituency_name
                  .replace(/\s+/g, "-")
                  .toLowerCase()}-${ward
                  .trim()
                  .replace(/\s+/g, "-")
                  .toLowerCase()}`,
              });
            });
          }
        });
      }
    });

    return {
      counties,
      constituencies,
      wards,
    };
  }, []); // Empty dependency array since countiesData is now a static import

  // Helper functions
  const getConstituenciesByCounty = (countyName) => {
    return processedData.constituencies.filter(
      (constituency) =>
        constituency.county_name.toLowerCase() === countyName.toLowerCase()
    );
  };

  const getWardsByConstituency = (constituencyName) => {
    return processedData.wards.filter(
      (ward) =>
        ward.constituency_name.toLowerCase() === constituencyName.toLowerCase()
    );
  };

  const getWardsByCounty = (countyName) => {
    return processedData.wards.filter(
      (ward) => ward.county_name.toLowerCase() === countyName.toLowerCase()
    );
  };

  const findCountyByName = (countyName) => {
    return processedData.counties.find(
      (county) => county.name.toLowerCase() === countyName.toLowerCase()
    );
  };

  const findConstituencyByName = (constituencyName) => {
    return processedData.constituencies.find(
      (constituency) =>
        constituency.name.toLowerCase() === constituencyName.toLowerCase()
    );
  };

  const findWardByName = (wardName) => {
    return processedData.wards.find(
      (ward) => ward.name.toLowerCase() === wardName.toLowerCase()
    );
  };

  const countyNames = processedData.counties?.map((county) => county.name);

  return {
    // Main data arrays
    counties: processedData.counties,
    countyNames,
    constituencies: processedData.constituencies,
    wards: processedData.wards,

    // Helper functions
    getConstituenciesByCounty,
    getWardsByConstituency,
    getWardsByCounty,
    findCountyByName,
    findConstituencyByName,
    findWardByName,

    // Stats
    totalCounties: processedData.counties.length,
    totalConstituencies: processedData.constituencies.length,
    totalWards: processedData.wards.length,
  };
};

export default useLocations;
