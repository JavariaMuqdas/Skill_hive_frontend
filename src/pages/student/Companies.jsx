import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import api from "../../services/api";
import "./student.css";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const BASE_URL = "http://127.0.0.1:8000/storage/";

  async function loadCompanies() {
    try {
      setLoading(true);
      setMsg("");

      const res = await api.get("/student/companies");
      const companiesData = res.data.companies || [];
      setCompanies(companiesData);
      setFilteredCompanies(companiesData); 
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  // 2. Auto-Reset Logic: Jab dono input khali ho jayein to sari companies dobara dikhayein
  // Auto-Reset Logic: Jab dono input khali ho jayein ya user location clear kare to sab dikhayein
  useEffect(() => {
    if (searchKeyword.trim() === "" && searchLocation.trim() === "") {
      setFilteredCompanies(companies);
    }
  }, [searchKeyword, searchLocation, companies]);

  // Search function (Pakistan fix ke sath)
  const handleSearch = () => {
    const keyword = searchKeyword.toLowerCase().trim();
    const locationInput = searchLocation.toLowerCase().trim();

    // Agar dono inputs khali hain, toh saara data return karo
    if (keyword === "" && locationInput === "") {
      setFilteredCompanies(companies);
      return;
    }

    const results = companies.filter((c) => {
      const name = (c.company_name || c.name || "").toLowerCase();
      const type = (c.company_type || c.companyType || c.industry || "").toLowerCase();
      const location = (c.location || c.city || c.country || c.address || "").toLowerCase();

      // Keyword match logic
      const matchesKeyword = keyword === "" || name.includes(keyword) || type.includes(keyword);

      // Location match logic: Agar user "pakistan" search kare, ya input khali ho, ya city match ho jaye
      const matchesLocation = 
        locationInput === "" || 
        locationInput === "pakistan" || 
        location.includes(locationInput);

      return matchesKeyword && matchesLocation;
    });

    setFilteredCompanies(results); 
  };

  // 1. Enter Key Handler Function
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (loading) {
    return <p className="loading">Loading companies...</p>;
  }

  return (
    
    <div className="companiesPage">
      
      <div className="companiesWrapper">

        <h2 className="companyHeading">Companies in Pakistan</h2>
        
        {/* Search Bar */}
        <div className="companySearchBar">
          <div style={{ position: "relative", display: "inline-block", flex: 1 }}>
            <FaSearch style={{ position: "absolute", left: "10px", top: "35%", color: "#888" }} />
            <input
              type="text"
              placeholder="Search by Keyword / Name"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleKeyDown} /* Enter key press check karne ke liye */
              style={{ paddingLeft: "30px", width: "100%" }}
            />
          </div>

          

          <div style={{ position: "relative", display: "inline-block", flex: 1 }}>
            <FaMapMarkerAlt style={{ position: "absolute", left: "10px", top: "35%", color: "#888" }} />
            <input
              type="text"
              placeholder="Location (e.g. Lahore or Pakistan)"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              onKeyDown={handleKeyDown} /* Enter key press check karne ke liye */
              style={{ paddingLeft: "30px", width: "100%" }}
            />
          </div>
          
          <button type="button" onClick={handleSearch}>
            Search
          </button>
        </div>

        

        {msg && <p className="errorMsg">{msg}</p>}

        <div className="companyGrid">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((c) => {
              const id = c.id || c.company_id || c.uuid;
              const name = c.company_name || c.name || "Unnamed Company";
              const founded = c.founded_year || c.foundedYear || c.year || c.founded || "—";
              const employees = c.employees_range || c.employeesRange || c.total_employees || c.employees || "—";
              const type = c.company_type || c.companyType || c.industry || "Private";
              const compLocation = c.location || c.city || c.country || "Pakistan";

              return (
                <Link
                  to={id ? `/student/companies/${id}` : "#"}
                  className="companyCardNew"
                  key={id || name}
                  style={{ textDecoration: "none", color: "inherit" }}
                  onClick={(e) => {
                    if (!id) e.preventDefault();
                  }}
                >
                  <div className="companyLogoBox">
                    {c.logo ? (
                      <img
                        src={BASE_URL + c.logo}
                        alt={name}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="companyLogoPlaceholder">
                        {name?.charAt(0)}
                      </div>
                    )}
                  </div>

                  <h3 className="companyNameNew">{name}</h3>

                  <div className="companyMeta">
                    <span>
                      <i className="fa-solid fa-flag"></i> Founded: {founded}
                    </span>

                    <span>
                      <i className="fa-solid fa-user-group"></i> Employees: {employees}
                    </span>
                  </div>

                  <div className="companyType">
                    <i className="fa-solid fa-building"></i> Type: {type}
                  </div>
                  
                  <div className="companyType" style={{ marginTop: "5px" }}>
                    <FaMapMarkerAlt /> {compLocation}
                  </div>

                  {!id && (
                    <p className="errorMsg" style={{ marginTop: 10 }}>
                      Company ID missing from API
                    </p>
                  )}
                </Link>
              );
            })
          ) : (
            <p className="noData">No companies match your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}