import "./company.css";

export default function DashboardOverview() {
  const stats = [
    { icon: "📌", label: "Active Projects", value: "4" },
    { icon: "👥", label: "Applicants", value: "28" },
    { icon: "✅", label: "Completed", value: "12" },
    { icon: "💰", label: "Escrow Pending", value: "PKR 85,000" },
  ];

  const projects = [
    { title: "React Landing Page", status: "Open", applicants: 7, budget: "PKR 15k" },
    { title: "Laravel API Integration", status: "In Progress", applicants: 10, budget: "PKR 25k" },
    { title: "UI Fixes (CSS)", status: "Open", applicants: 5, budget: "PKR 8k" },
  ];

  return (
    <div className="cPage">
      <div className="cHead">
        <h2 className="cTitle">Dashboard</h2>
        <p className="cSub">Overview of posted projects & applicants</p>
      </div>

      <div className="cGrid4">
        {stats.map((s) => (
          <div key={s.label} className="cCard">
            <div className="cCardIcon">{s.icon}</div>
            <div className="cCardValue">{s.value}</div>
            <div className="cCardLabel">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="cSection">
        <div className="cSectionTop">
          <h3 className="cSectionTitle">Recent Projects</h3>
        </div>

        <div className="cTableWrap">
          <table className="cTable">
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Applicants</th>
                <th>Budget</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.title}>
                  <td>{p.title}</td>
                  <td><span className={"cPill " + (p.status === "Open" ? "open" : "prog")}>{p.status}</span></td>
                  <td>{p.applicants}</td>
                  <td>{p.budget}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
