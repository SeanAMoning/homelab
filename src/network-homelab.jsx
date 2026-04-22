import { useState } from "react";

const hardware = [
  {
    category: "Core Routing & Switching",
    icon: "⬡",
    items: [
      { name: "Cisco Catalyst 2960 (or 3560)", price: "$30–80", note: "Layer 2/3 managed switch — VLANs, STP, EtherChannel" },
      { name: "MikroTik RB450Gx4 or Cisco ISR 1841", price: "$40–120", note: "Router for BGP, OSPF, static routing labs" },
      { name: "Ubiquiti EdgeRouter X", price: "$60", note: "Budget router great for firewall + routing combos" },
    ]
  },
  {
    category: "Wireless",
    icon: "◎",
    items: [
      { name: "Ubiquiti UniFi AP AC Lite", price: "$80–100", note: "Enterprise-style WiFi with UniFi controller" },
      { name: "Old WiFi Router (flashed w/ OpenWRT)", price: "$0–20", note: "Lab with custom firmware, VLANs, and WPA Enterprise" },
    ]
  },
  {
    category: "Firewall / Security",
    icon: "▣",
    items: [
      { name: "Protectli VP2420 (pfSense box)", price: "$200–300", note: "Run pfSense or OPNsense — IDS, VPN, NAT, firewall rules" },
      { name: "Old x86 PC w/ 2 NICs", price: "$30–60", note: "Budget pfSense/OPNsense host" },
    ]
  },
  {
    category: "Servers / Virtualization",
    icon: "▤",
    items: [
      { name: "Mini PC (Beelink S12 Pro or similar)", price: "$150–200", note: "Run Proxmox VE to host VMs and containers" },
      { name: "Raspberry Pi 4 (4GB+)", price: "$55–80", note: "Pi-hole DNS sinkhole, monitoring, lightweight services" },
      { name: "Old Desktop / Laptop", price: "$0–50", note: "Repurpose as Proxmox or ESXi host" },
    ]
  },
  {
    category: "Cabling & Physical",
    icon: "⬛",
    items: [
      { name: "Cat6 Ethernet Cables (assorted)", price: "$15–30", note: "You'll need 10+ of various lengths" },
      { name: "8-port Unmanaged Switch", price: "$15–25", note: "Expand ports to connect everything" },
      { name: "Patch Panel + Keystone Jacks", price: "$30–60", note: "Optional but professional cable management" },
      { name: "UPS (APC BE600M1)", price: "$60–100", note: "Protect gear from power surges and outages" },
    ]
  },
  {
    category: "Monitoring & Tooling",
    icon: "◈",
    items: [
      { name: "USB Console Cable (Cisco rollover)", price: "$10–15", note: "Essential for out-of-band access to Cisco gear" },
      { name: "Laptop / PC as Management Host", price: "$0", note: "Run Wireshark, PuTTY/SecureCRT, GNS3/EVE-NG" },
    ]
  }
];

const projects = [
  {
    week: "Weeks 1–2",
    phase: "Foundation",
    color: "#00ff9d",
    tasks: [
      "Set up physical lab — rack or shelf layout, cable all devices",
      "Configure managed switch: VLANs (mgmt, lab, DMZ, guest)",
      "Set up router with static routes between VLANs",
      "Install Proxmox on mini PC, spin up first VMs (Ubuntu, Windows Server)",
    ]
  },
  {
    week: "Weeks 3–4",
    phase: "Routing Protocols",
    color: "#00d4ff",
    tasks: [
      "Configure OSPF between router and Proxmox VM running FRRouting",
      "Set up EIGRP (Cisco) or simulate with GNS3/EVE-NG",
      "Lab BGP with two ASNs using FRRouting VMs",
      "Practice route redistribution between OSPF and static",
    ]
  },
  {
    week: "Weeks 5–6",
    phase: "Switching Deep Dive",
    color: "#ffd700",
    tasks: [
      "Configure Spanning Tree (STP/RSTP) and observe topology changes",
      "Set up EtherChannel (LACP) between two switches",
      "Implement 802.1Q trunking and inter-VLAN routing",
      "Practice VTP, port security, and DHCP snooping",
    ]
  },
  {
    week: "Weeks 7–8",
    phase: "Firewall & Security",
    color: "#ff6b6b",
    tasks: [
      "Deploy pfSense/OPNsense — configure NAT, firewall rules",
      "Set up IDS/IPS with Suricata on pfSense",
      "Create site-to-site IPsec VPN tunnel between two pfSense VMs",
      "Set up OpenVPN or WireGuard for remote access VPN",
    ]
  },
  {
    week: "Weeks 9–10",
    phase: "Network Services",
    color: "#c084fc",
    tasks: [
      "Deploy Pi-hole for DNS with custom blocklists",
      "Set up DHCP server with reservations and option scopes",
      "Configure NTP server, Syslog (Graylog or ELK stack)",
      "Set up RADIUS with FreeRADIUS for 802.1X port auth",
    ]
  },
  {
    week: "Weeks 11–12",
    phase: "Monitoring & Automation",
    color: "#fb923c",
    tasks: [
      "Deploy Zabbix or LibreNMS for SNMP monitoring",
      "Set up Grafana + InfluxDB for custom dashboards",
      "Write Ansible playbooks to push switch/router configs",
      "Capture and analyze traffic with Wireshark — practice reading pcaps",
    ]
  }
];

export default function HomeLabGuide() {
  const [activeTab, setActiveTab] = useState("hardware");
  const [expandedPhase, setExpandedPhase] = useState(null);

  return (
    <div style={{
      fontFamily: "'Courier New', monospace",
      background: "#0a0a0f",
      minHeight: "100vh",
      color: "#e0e0e0",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0a0a0f 0%, #0f1a2e 50%, #0a0a0f 100%)",
        borderBottom: "1px solid #00ff9d33",
        padding: "40px 32px 32px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Grid background */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "linear-gradient(#00ff9d 1px, transparent 1px), linear-gradient(90deg, #00ff9d 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff9d", boxShadow: "0 0 12px #00ff9d" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.2em", color: "#00ff9d", textTransform: "uppercase" }}>sys:homelab_v1.0</span>
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}>
            Network Engineering<br />
            <span style={{ color: "#00ff9d" }}>Home Lab</span>
          </h1>
          <p style={{ margin: 0, color: "#8899aa", fontSize: 14, letterSpacing: "0.05em" }}>
            12-WEEK SUMMER BUILD PLAN · CCNA → ADVANCED NETWORKING
          </p>
        </div>
      </div>

      {/* Tab Nav */}
      <div style={{ borderBottom: "1px solid #1a2a3a", background: "#0a0e14" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex" }}>
          {["hardware", "roadmap"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "14px 28px",
                background: "none",
                border: "none",
                borderBottom: activeTab === tab ? "2px solid #00ff9d" : "2px solid transparent",
                color: activeTab === tab ? "#00ff9d" : "#556677",
                cursor: "pointer",
                fontSize: 12,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontFamily: "'Courier New', monospace",
                transition: "color 0.2s",
              }}
            >
              {tab === "hardware" ? "// Hardware List" : "// 12-Week Roadmap"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>

        {activeTab === "hardware" && (
          <div>
            {/* Budget summary */}
            <div style={{
              background: "#0f1a1a",
              border: "1px solid #00ff9d22",
              borderLeft: "3px solid #00ff9d",
              borderRadius: 4,
              padding: "16px 20px",
              marginBottom: 32,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}>
              <div>
                <div style={{ fontSize: 11, color: "#00ff9d", letterSpacing: "0.15em", marginBottom: 4 }}>ESTIMATED TOTAL BUDGET</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>$700 – $1,100</div>
              </div>
              <div style={{ fontSize: 12, color: "#8899aa", maxWidth: 380, lineHeight: 1.6 }}>
                Prices are used/refurbished estimates. eBay, r/homelab, and Facebook Marketplace can cut costs by 40–60%. Reusing old PCs drops cost further.
              </div>
            </div>

            {hardware.map((cat) => (
              <div key={cat.category} style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ color: "#00ff9d", fontSize: 16 }}>{cat.icon}</span>
                  <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#aac" }}>
                    {cat.category}
                  </span>
                  <div style={{ flex: 1, height: 1, background: "#1a2a3a", marginLeft: 8 }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {cat.items.map((item) => (
                    <div key={item.name} style={{
                      background: "#0d1420",
                      border: "1px solid #1a2a3a",
                      borderRadius: 4,
                      padding: "14px 18px",
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: "8px 16px",
                      alignItems: "start",
                    }}>
                      <div>
                        <div style={{ fontSize: 14, color: "#e8eef4", fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: "#667788", lineHeight: 1.5 }}>{item.note}</div>
                      </div>
                      <div style={{
                        fontSize: 13,
                        color: "#00ff9d",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        background: "#00ff9d11",
                        padding: "3px 10px",
                        borderRadius: 3,
                      }}>{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Tips */}
            <div style={{
              background: "#0f1420",
              border: "1px solid #00d4ff22",
              borderLeft: "3px solid #00d4ff",
              borderRadius: 4,
              padding: "18px 20px",
              marginTop: 8,
            }}>
              <div style={{ fontSize: 11, color: "#00d4ff", letterSpacing: "0.15em", marginBottom: 12 }}>PRO TIPS</div>
              {[
                "Start with just a switch, one router, and one PC — expand as you go.",
                "GNS3 or EVE-NG can simulate routers/switches in software — great before buying hardware.",
                "Check r/homelabsales and eBay 'completed listings' for realistic used prices.",
                "Cisco Packet Tracer (free) is great for pure CCNA prep without any hardware at all.",
              ].map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13, color: "#8899aa", lineHeight: 1.6 }}>
                  <span style={{ color: "#00d4ff", flexShrink: 0 }}>›</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "roadmap" && (
          <div>
            <div style={{
              background: "#0f1420",
              border: "1px solid #1a2a3a",
              borderRadius: 4,
              padding: "16px 20px",
              marginBottom: 32,
              fontSize: 13,
              color: "#8899aa",
              lineHeight: 1.7,
            }}>
              Each phase builds on the last. By the end of the summer you'll have hands-on experience covering most of the <span style={{ color: "#ffd700" }}>CCNA</span>, <span style={{ color: "#00d4ff" }}>CCNP</span> routing/switching topics, plus real-world firewall, VPN, and automation skills.
            </div>

            {projects.map((phase, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <button
                  onClick={() => setExpandedPhase(expandedPhase === i ? null : i)}
                  style={{
                    width: "100%",
                    background: expandedPhase === i ? "#0f1a2e" : "#0d1420",
                    border: `1px solid ${expandedPhase === i ? phase.color + "55" : "#1a2a3a"}`,
                    borderLeft: `3px solid ${phase.color}`,
                    borderRadius: 4,
                    padding: "16px 18px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{
                      fontSize: 11,
                      color: phase.color,
                      letterSpacing: "0.12em",
                      background: phase.color + "18",
                      padding: "3px 10px",
                      borderRadius: 3,
                      whiteSpace: "nowrap",
                    }}>{phase.week}</span>
                    <span style={{ fontSize: 15, color: "#ddeeff", fontWeight: 600 }}>{phase.phase}</span>
                  </div>
                  <span style={{ color: "#445566", fontSize: 16, transition: "transform 0.2s", transform: expandedPhase === i ? "rotate(90deg)" : "none" }}>›</span>
                </button>

                {expandedPhase === i && (
                  <div style={{
                    background: "#080d14",
                    border: `1px solid ${phase.color}22`,
                    borderTop: "none",
                    borderRadius: "0 0 4px 4px",
                    padding: "16px 18px",
                  }}>
                    {phase.tasks.map((task, j) => (
                      <div key={j} style={{
                        display: "flex",
                        gap: 12,
                        marginBottom: j < phase.tasks.length - 1 ? 12 : 0,
                        padding: "10px 14px",
                        background: "#0d1520",
                        borderRadius: 3,
                        border: "1px solid #1a2a3a",
                        fontSize: 13,
                        color: "#aabbcc",
                        lineHeight: 1.5,
                        alignItems: "flex-start",
                      }}>
                        <span style={{ color: phase.color, marginTop: 2, flexShrink: 0 }}>▸</span>
                        {task}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Certifications banner */}
            <div style={{
              marginTop: 32,
              background: "linear-gradient(135deg, #0f1a2e, #1a0f2e)",
              border: "1px solid #c084fc33",
              borderLeft: "3px solid #c084fc",
              borderRadius: 4,
              padding: "20px",
            }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#c084fc", marginBottom: 12 }}>EXAM PREP ALIGNMENT</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[
                  { cert: "CCNA 200-301", match: "Weeks 1–6", color: "#00ff9d" },
                  { cert: "CompTIA Network+", match: "Weeks 1–8", color: "#00d4ff" },
                  { cert: "CCNP ENCOR", match: "Weeks 3–10", color: "#ffd700" },
                  { cert: "Sec+ / NSE4", match: "Weeks 7–12", color: "#ff6b6b" },
                ].map(c => (
                  <div key={c.cert} style={{
                    background: "#0a0a14",
                    border: `1px solid ${c.color}33`,
                    borderRadius: 3,
                    padding: "8px 14px",
                  }}>
                    <div style={{ fontSize: 13, color: c.color, fontWeight: 700 }}>{c.cert}</div>
                    <div style={{ fontSize: 11, color: "#667788", marginTop: 2 }}>{c.match}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
