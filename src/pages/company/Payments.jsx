import "./company.css";

export default function Payments() {
  const pending = [
    { id: 1, project: "Laravel API Integration", amount: "PKR 25,000", status: "Escrowed" },
  ];
  const completed = [
    { id: 2, project: "React Landing Page", amount: "PKR 15,000", status: "Released" },
  ];

  return (
    <div className="cPage">
      <div className="cHead">
        <h2 className="cTitle">Payments</h2>
        <p className="cSub">Pending → Escrowed funds | Completed → Released payments</p>
      </div>

      <div className="cSection">
        <h3 className="cSectionTitle">Pending</h3>
        <div className="cTableWrap">
          <table className="cTable">
            <thead><tr><th>Project</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {pending.map((p) => (
                <tr key={p.id}>
                  <td>{p.project}</td>
                  <td>{p.amount}</td>
                  <td><span className="cPill prog">{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="cSection">
        <h3 className="cSectionTitle">Completed</h3>
        <div className="cTableWrap">
          <table className="cTable">
            <thead><tr><th>Project</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {completed.map((p) => (
                <tr key={p.id}>
                  <td>{p.project}</td>
                  <td>{p.amount}</td>
                  <td><span className="cPill ok">{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
