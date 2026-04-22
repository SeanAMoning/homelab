import { useState, useEffect } from "react";

// ─── CCNA 200-301 EXAM DOMAINS ───────────────────────────────────────────────
const ccnaDomains = [
  {
    domain: "1.0 Network Fundamentals", weight: "20%", color: "#00ff9d",
    topics: [
      { id:"1.1", text:"Role/function of routers, L2/L3 switches, firewalls, APs, controllers, endpoints, PoE", lab:"Identify each device in your physical lab. Configure PoE on switch port for UniFi AP.", hw:"Cisco 2960-X, MikroTik RB4011, Protectli pfSense box, UniFi U6 Lite", sw:"Cisco IOS, RouterOS" },
      { id:"1.2", text:"Network topology architectures: 2-tier, 3-tier, spine-leaf, WAN, SOHO, on-prem/cloud", lab:"Draw your lab as a 2-tier (access/core) topology. Document on paper or draw.io.", hw:"Switch + Router", sw:"draw.io (free)" },
      { id:"1.3", text:"Physical interfaces: single-mode fiber, multimode fiber, copper cabling types", lab:"Use Cat6 copper in your lab. Research SFP modules for fiber uplinks on your switch.", hw:"Cat6 cables, SFP-capable switch", sw:"N/A" },
      { id:"1.4", text:"Interface/cable issues: collisions, errors, duplex/speed mismatch", lab:"Intentionally misconfigure duplex on a switch port and observe errors with 'show interfaces'.", hw:"Cisco 2960-X", sw:"Cisco IOS CLI" },
      { id:"1.5", text:"Compare TCP vs UDP", lab:"Capture TCP handshake and UDP DNS queries in Wireshark. Compare in protocol dissector.", hw:"Any PC", sw:"Wireshark" },
      { id:"1.6", text:"Configure and verify IPv4 addressing and subnetting", lab:"Subnet a /24 into VLANs: 10.0.10.0/26 mgmt, 10.0.20.0/25 lab, 10.0.30.0/27 DMZ.", hw:"Switch + Router", sw:"Cisco IOS / RouterOS" },
      { id:"1.7", text:"Private IPv4 addressing (RFC 1918)", lab:"Use 10.x.x.x space throughout your lab. Verify NAT overload to ISP via pfSense.", hw:"pfSense box", sw:"pfSense" },
      { id:"1.8", text:"IPv6 addressing, types, and neighbor discovery", lab:"Enable IPv6 on router interfaces. Configure static and SLAAC addressing on VMs.", hw:"MikroTik or Cisco router", sw:"RouterOS / IOS" },
      { id:"1.9", text:"IPv4/IPv6 static routes", lab:"Configure static default route and summary routes. Verify with ping and traceroute.", hw:"Router", sw:"IOS / RouterOS" },
      { id:"1.10", text:"Wireless principles: SSID, RF, encryption, AP modes", lab:"Configure multiple SSIDs mapped to VLANs (lab/guest/mgmt) on UniFi AP.", hw:"UniFi U6 Lite", sw:"UniFi Network Controller" },
      { id:"1.11", text:"Virtualization fundamentals (VMs, vSwitches, Type 1/2 hypervisors)", lab:"Deploy 4+ VMs on Proxmox. Create vSwitch bridges mapped to VLANs.", hw:"Beelink mini PC", sw:"Proxmox VE" },
      { id:"1.12", text:"Switching concepts: MAC table, frame flooding, VLAN, trunk", lab:"Observe MAC address table with 'show mac address-table'. Flood with unknown unicast test.", hw:"Cisco 2960-X", sw:"Cisco IOS" },
    ]
  },
  {
    domain: "2.0 Network Access", weight: "20%", color: "#00d4ff",
    topics: [
      { id:"2.1", text:"VLANs and interVLAN routing (Router-on-a-stick, L3 switch)", lab:"Configure 4 VLANs. Use router-on-a-stick with subinterfaces AND L3 SVI method on 3560.", hw:"Cisco 2960-X or 3560-CX, router", sw:"Cisco IOS" },
      { id:"2.2", text:"Trunking (802.1Q), DTP, native VLAN", lab:"Configure trunk between switch and router. Set native VLAN to unused VLAN 999.", hw:"Cisco switch", sw:"Cisco IOS" },
      { id:"2.3", text:"EtherChannel (LACP, PAgP, static)", lab:"Bundle 2 ports between two switches with LACP. Verify with 'show etherchannel summary'.", hw:"Two Cisco switches", sw:"Cisco IOS" },
      { id:"2.4", text:"Spanning Tree: STP, RSTP, port states/roles, BPDU guard, PortFast", lab:"Set root bridge with priority. Enable PortFast+BPDU guard on access ports. Force topology change.", hw:"Cisco 2960-X", sw:"Cisco IOS" },
      { id:"2.5", text:"Cisco Wireless: AP modes (local, flexconnect), WLC, CAPWAP", lab:"Configure UniFi AP in standard mode. Explore controller-based config vs standalone.", hw:"UniFi U6 Lite", sw:"UniFi Controller" },
      { id:"2.6", text:"Wireless security: WPA2/WPA3, 802.1X/EAP, PSK", lab:"Configure WPA3-Personal and WPA2-Enterprise (802.1X) on separate SSIDs with FreeRADIUS.", hw:"UniFi AP, Pi/VM for RADIUS", sw:"FreeRADIUS, UniFi Controller" },
    ]
  },
  {
    domain: "3.0 IP Connectivity", weight: "25%", color: "#ffd700",
    topics: [
      { id:"3.1", text:"Components of routing table: prefix, metric, AD, next-hop, gateway", lab:"Examine routing table with 'show ip route'. Identify C, S, O, D routes and their ADs.", hw:"Router", sw:"Cisco IOS / RouterOS" },
      { id:"3.2", text:"Determine how a router makes forwarding decisions (LPM, AD, metric)", lab:"Create overlapping routes and verify longest-prefix match wins. Test AD tiebreaker.", hw:"Router + FRRouting VM", sw:"IOS / FRRouting" },
      { id:"3.3", text:"Configure and verify IPv4/IPv6 static routing (default, floating, summary)", lab:"Configure floating static route (AD 254) as backup to OSPF route. Test failover.", hw:"Router", sw:"IOS / RouterOS" },
      { id:"3.4", text:"Configure and verify single-area OSPFv2: neighbor adj, point-to-point, broadcast", lab:"Run OSPF between router and two Linux FRR VMs. Verify adjacency with 'show ip ospf neighbor'.", hw:"Router, Proxmox VMs", sw:"FRRouting on Ubuntu" },
      { id:"3.5", text:"Configure and verify EIGRPv4 (metrics, feasible successor, passive interface)", lab:"Configure EIGRP on Cisco router. Observe feasible successor and topology table.", hw:"Cisco router (or GNS3)", sw:"Cisco IOS / GNS3" },
    ]
  },
  {
    domain: "4.0 IP Services", weight: "10%", color: "#fb923c",
    topics: [
      { id:"4.1", text:"NAT: static, dynamic, PAT/overload", lab:"Configure PAT overload on pfSense for lab VLAN internet access. Add static NAT for DMZ server.", hw:"pfSense box", sw:"pfSense / OPNsense" },
      { id:"4.2", text:"NTP: client/server, stratum, authentication", lab:"Configure MikroTik as NTP server (stratum 2). Point all VMs and switches to it.", hw:"Router, all devices", sw:"RouterOS, chrony/ntpd" },
      { id:"4.3", text:"DHCP: server, relay, exclude, options (default-router, DNS, domain)", lab:"Configure DHCP server on Windows Server with scopes per VLAN. Add helper-address on router.", hw:"Proxmox VM (Windows Server)", sw:"Windows Server DHCP" },
      { id:"4.4", text:"DNS: forward lookup, A/AAAA/PTR/MX records, local resolver", lab:"Deploy Pi-hole as DNS resolver. Add local DNS entries for all lab devices.", hw:"Raspberry Pi 4", sw:"Pi-hole" },
      { id:"4.5", text:"SNMP v2c/v3, syslog severity levels", lab:"Configure SNMP v3 on all switches. Set up syslog forwarding to Graylog.", hw:"Cisco switch, Proxmox VM", sw:"LibreNMS, Graylog" },
      { id:"4.6", text:"QoS: DSCP, CoS, traffic shaping/policing, queuing", lab:"Configure DSCP markings on MikroTik for VoIP traffic class. Observe queue behavior.", hw:"MikroTik RB4011", sw:"RouterOS QoS" },
      { id:"4.7", text:"SSH, TFTP, FTP — configure and verify", lab:"Harden all devices: disable Telnet, enforce SSHv2 with key auth. Set up TFTP for IOS backups.", hw:"All devices", sw:"OpenSSH, tftpd-hpa" },
    ]
  },
  {
    domain: "5.0 Security Fundamentals", weight: "15%", color: "#ff6b6b",
    topics: [
      { id:"5.1", text:"Key security concepts: threats, vulnerabilities, exploits, CIA triad", lab:"Review your network design against CIA triad. Document threat model for your lab.", hw:"N/A", sw:"N/A (conceptual)" },
      { id:"5.2", text:"ACLs: standard, extended, named — IPv4 and IPv6", lab:"Create extended ACL blocking DMZ→LAN. Apply named ACL inbound on router subinterface.", hw:"Cisco router", sw:"Cisco IOS" },
      { id:"5.3", text:"Layer 2 security: DHCP snooping, DAI, IP source guard, 802.1X", lab:"Enable DHCP snooping on all VLANs. Configure DAI to validate ARP. Test with ARP spoofing tool.", hw:"Cisco 2960-X", sw:"Cisco IOS, Scapy for testing" },
      { id:"5.4", text:"AAA concepts and 802.1X port-based auth", lab:"Deploy FreeRADIUS. Configure 802.1X on switch ports with RADIUS auth to FreeRADIUS VM.", hw:"Cisco switch, Pi/VM", sw:"FreeRADIUS" },
      { id:"5.5", text:"VPN concepts: site-to-site, remote access, SSL, IPsec, GRE", lab:"Configure IPsec site-to-site between two pfSense VMs. Set up OpenVPN for remote access.", hw:"pfSense box, Proxmox VMs", sw:"pfSense VPN" },
      { id:"5.6", text:"Firewall and IPS/IDS operation", lab:"Configure pfSense zones: LAN/DMZ/WAN. Enable Suricata IDS. Generate test alerts with curl.", hw:"Protectli pfSense box", sw:"pfSense, Suricata" },
    ]
  },
  {
    domain: "6.0 Automation & Programmability", weight: "10%", color: "#c084fc",
    topics: [
      { id:"6.1", text:"Automation impact on networks, controller-based vs traditional", lab:"Compare manually configuring 10 switch ports vs Ansible playbook doing same in seconds.", hw:"Cisco switch", sw:"Ansible" },
      { id:"6.2", text:"SDN architecture: data/control/management planes, Cisco DNA Center", lab:"Research DNA Center in GNS3 EVE-NG. Run FRRouting and observe control plane separation.", hw:"Proxmox VM", sw:"EVE-NG / GNS3" },
      { id:"6.3", text:"REST APIs: CRUD, HTTP verbs, JSON/XML, Postman", lab:"Use Cisco DevNet Sandbox REST API. Call MikroTik REST API with curl and Python requests.", hw:"Any PC", sw:"Postman, Python, MikroTik REST" },
      { id:"6.4", text:"Configuration management tools: Puppet, Chef, Ansible", lab:"Write Ansible playbooks to push VLAN configs and backup running configs on schedule.", hw:"Any PC", sw:"Ansible, Git" },
      { id:"6.5", text:"JSON/XML/YAML data encoding formats", lab:"Parse 'show interfaces' JSON output from MikroTik API with Python. Compare to YAML config.", hw:"Any PC", sw:"Python, jq, PyYAML" },
    ]
  }
];

// ─── CCNP ENCOR 350-401 EXAM DOMAINS ─────────────────────────────────────────
const ccnpDomains = [
  {
    domain: "1.0 Architecture", weight: "15%", color: "#00ff9d",
    topics: [
      { id:"1.1", text:"Enterprise design: 2-tier, 3-tier, fabric, cloud — high availability, redundancy, FHRP, SSO", lab:"Configure HSRP between two routers for gateway redundancy. Test failover with active router shutdown.", hw:"Two routers (or FRR VMs)", sw:"IOS / FRRouting VRRP" },
      { id:"1.2", text:"Cisco Catalyst SD-WAN: control/data planes, benefits and limitations", lab:"Research in EVE-NG. Deploy vEdge and vSmart controllers in simulation.", hw:"Proxmox VM (EVE-NG)", sw:"EVE-NG Community" },
      { id:"1.3", text:"Cisco SD-Access: control/data planes, traditional campus interop", lab:"Deploy ISE and DNA Center in simulation. Study LISP and VXLAN fabric encapsulation.", hw:"Proxmox VM", sw:"EVE-NG / GNS3" },
      { id:"1.4", text:"QoS configurations: DSCP, COS, traffic marking, policing, shaping, queuing", lab:"Configure MQC (Modular QoS CLI) on Cisco router: classify VoIP, mark DSCP EF, police burst.", hw:"Cisco router or FRR VM", sw:"Cisco IOS / RouterOS" },
    ]
  },
  {
    domain: "2.0 Virtualization", weight: "10%", color: "#00d4ff",
    topics: [
      { id:"2.1", text:"Hypervisor Type 1/2, VMs, virtual switching", lab:"Run Proxmox (Type 1) and VirtualBox (Type 2). Create vSwitch bridges. Compare behavior.", hw:"Beelink mini PC", sw:"Proxmox VE, VirtualBox" },
      { id:"2.2", text:"VRF, GRE tunneling, IPsec tunneling", lab:"Configure VRF-Lite on MikroTik to isolate routing tables. Build GRE tunnel between two VMs.", hw:"MikroTik RB4011, Proxmox VMs", sw:"RouterOS, FRRouting" },
      { id:"2.3", text:"Network virtualization: LISP, VXLAN", lab:"Configure VXLAN overlay between two Linux VMs using iproute2. Observe encapsulated frames.", hw:"Proxmox VMs", sw:"Ubuntu + iproute2" },
    ]
  },
  {
    domain: "3.0 Infrastructure", weight: "30%", color: "#ffd700",
    topics: [
      { id:"3.1", text:"Layer 2: switch port config, 802.1Q, VLANs, RSTP, MST, EtherChannel LACP", lab:"Configure MST (Multiple Spanning Tree) with two instances across VLANs. Compare to RSTP.", hw:"Cisco switches (or GNS3)", sw:"Cisco IOS" },
      { id:"3.2", text:"Layer 3: OSPFv2/v3 (multi-area), EIGRP, BGP path selection, route filtering", lab:"Multi-area OSPF: Area 0 backbone + Area 1 stub + Area 2 NSSA. Configure ABR summarization.", hw:"Router + FRR VMs", sw:"FRRouting / IOS" },
      { id:"3.3", text:"BGP: eBGP/iBGP, path attributes, route filtering, communities", lab:"Configure eBGP between two FRR ASNs. Manipulate path with LOCAL_PREF and MED attributes.", hw:"Proxmox VMs (FRR)", sw:"FRRouting" },
      { id:"3.4", text:"EIGRP: metric, feasible successor, stub, summary, authentication", lab:"EIGRP named mode on Cisco. Configure MD5 authentication. Observe DUAL algorithm with debug.", hw:"Cisco router or GNS3", sw:"Cisco IOS / GNS3" },
      { id:"3.5", text:"MPLS: label switching, LDP, L3VPN concepts", lab:"Configure MPLS with LDP on FRRouting VMs. Observe label forwarding table.", hw:"Proxmox VMs (FRR)", sw:"FRRouting MPLS" },
      { id:"3.6", text:"DMVPN, FlexVPN (IKEv2), GETVPN concepts", lab:"Build DMVPN Phase 2 hub-spoke in GNS3/EVE-NG using IOS images.", hw:"GNS3/EVE-NG with IOS image", sw:"GNS3 / EVE-NG" },
      { id:"3.7", text:"Wireless: 802.11 standards, RSSI, SNR, RF channels, roaming, QoS/WMM", lab:"Scan RF environment with UniFi. Configure non-overlapping channels 1/6/11. Test roaming.", hw:"UniFi U6 Lite", sw:"UniFi Network Controller" },
      { id:"3.8", text:"IPv6: addressing, routing, tunneling (6in4, GRE), ICMPv6, DHCPv6", lab:"Configure OSPFv3 for IPv6 routing. Set up DHCPv6 prefix delegation. Test 6in4 tunnel.", hw:"Router + Proxmox VMs", sw:"FRRouting / RouterOS" },
    ]
  },
  {
    domain: "4.0 Network Assurance", weight: "10%", color: "#fb923c",
    topics: [
      { id:"4.1", text:"Diagnose issues with SNMP, syslog, EEM, debug, show commands", lab:"Write Cisco EEM script to auto-react to interface down event. Send syslog alert.", hw:"Cisco switch/router", sw:"Cisco IOS EEM" },
      { id:"4.2", text:"IP SLA: probes, tracking objects, icmp-echo, udp-jitter", lab:"Configure IP SLA ICMP-echo probe. Track object tied to static route — auto-failover test.", hw:"Cisco router", sw:"Cisco IOS" },
      { id:"4.3", text:"NetFlow/IPFIX, SPAN/RSPAN, Wireshark packet capture", lab:"Configure SPAN on Cisco switch to mirror traffic to Wireshark VM. Analyze OSPF and BGP packets.", hw:"Cisco 2960-X, Proxmox VM", sw:"Wireshark, ntopng" },
      { id:"4.4", text:"Network monitoring: Cisco DNA Assurance, SNMP polling, dashboards", lab:"Deploy LibreNMS for SNMP polling. Build Grafana dashboard fed by InfluxDB/Telegraf.", hw:"Proxmox VM or Raspberry Pi", sw:"LibreNMS, Grafana, InfluxDB" },
    ]
  },
  {
    domain: "5.0 Security", weight: "20%", color: "#ff6b6b",
    topics: [
      { id:"5.1", text:"Device hardening: AAA, RBAC, TACACS+, local auth, enable secret", lab:"Configure TACACS+ with FreeRADIUS/tac_plus for switch login. Set privilege levels.", hw:"Cisco switch, Proxmox VM", sw:"tac_plus / FreeRADIUS" },
      { id:"5.2", text:"Network security: ACLs, CoPP, uRPF, DHCP snooping, DAI", lab:"Configure Control Plane Policing (CoPP) on Cisco router to rate-limit ICMP/SSH to CPU.", hw:"Cisco router", sw:"Cisco IOS" },
      { id:"5.3", text:"Cisco TrustSec, SGT, 802.1X with ISE, MACsec", lab:"Configure 802.1X with RADIUS/FreeRADIUS on switch ports. Test with supplicant VM.", hw:"Cisco switch, FreeRADIUS VM", sw:"FreeRADIUS, wpa_supplicant" },
      { id:"5.4", text:"VPN: DMVPN, FlexVPN, IPsec, GRE, SSL VPN", lab:"Build IPsec IKEv2 tunnel between pfSense and FRRouting VM. Verify with crypto session.", hw:"pfSense box, FRR VM", sw:"pfSense, FRRouting" },
      { id:"5.5", text:"Wireless security: WPA3, 802.1X, WIPS, rogue AP detection", lab:"Configure WIPS on UniFi controller. Scan for rogue APs. Enable WPA3 on all SSIDs.", hw:"UniFi U6 Lite", sw:"UniFi Controller" },
    ]
  },
  {
    domain: "6.0 Automation", weight: "15%", color: "#c084fc",
    topics: [
      { id:"6.1", text:"Python scripting for network automation: Netmiko, NAPALM, nornir", lab:"Write Python script using Netmiko to SSH into Cisco switch and pull 'show interfaces' output.", hw:"Cisco switch, any PC", sw:"Python, Netmiko, NAPALM" },
      { id:"6.2", text:"Ansible for network: playbooks, inventory, modules (ios_config, nxos)", lab:"Ansible playbook to configure VLANs on switch, backup configs to Git, and generate reports.", hw:"Cisco switch, any PC", sw:"Ansible, Git" },
      { id:"6.3", text:"REST/RESTCONF/NETCONF APIs, YANG models, JSON/XML parsing", lab:"Use RESTCONF to query Cisco IOS-XE device config. Parse YANG model with pyang.", hw:"Cisco IOS-XE router or DevNet sandbox", sw:"Python requests, pyang, Postman" },
      { id:"6.4", text:"Git version control, CI/CD pipelines for network configs", lab:"Store all lab configs in Git. Create simple CI pipeline using GitHub Actions to validate configs.", hw:"Any PC", sw:"Git, GitHub Actions, Ansible-lint" },
    ]
  }
];

// ─── HARDWARE ─────────────────────────────────────────────────────────────────
const hardware = [
  { category: "Core Routing & Switching", icon: "⬡", items: [
    { name: "Cisco Catalyst 2960-X", price: "$40–90", tier: "Essential", specs: "48x GbE, 2x SFP+, PoE+", software: "Cisco IOS 15.x", usedFor: "VLANs, STP/RSTP/MST, EtherChannel, DHCP snooping, DAI, port security, 802.1X, CoPP", buy: "eBay", covers: "CCNA 2.x, 5.3 / CCNP 3.1, 4.3, 5.2" },
    { name: "Cisco 3560-CX (Layer 3)", price: "$60–120", tier: "Upgrade", specs: "12x GbE, 2x SFP+, L3 routing", software: "Cisco IOS IP Services", usedFor: "Inter-VLAN routing (SVI), OSPF, ACLs, QoS — expands CCNP L3 switching labs", buy: "eBay", covers: "CCNA 2.1, 3.x / CCNP 3.1, 3.2" },
    { name: "MikroTik RB4011", price: "$120–160", tier: "Essential", specs: "10x GbE, 1x SFP+, ARM quad-core", software: "RouterOS v7", usedFor: "BGP, OSPF, MPLS, VRF, GRE, QoS, REST API for automation labs, DHCP/DNS", buy: "mikrotik.com / Amazon", covers: "CCNA 3.x, 4.x, 6.x / CCNP 3.2–3.6" },
    { name: "Cisco ISR 1841 / 2801", price: "$25–50", tier: "Budget Alt", specs: "2x WAN, 2x LAN, modular WIC slots", software: "Cisco IOS 12.4", usedFor: "EIGRP, OSPF, NAT, ACLs, IOS EEM scripting, DMVPN, IPsec, IP SLA", buy: "eBay", covers: "CCNA 3-5 / CCNP 3.2-3.6, 4.2, 5.x" },
  ]},
  { category: "Firewall / Security", icon: "▣", items: [
    { name: "Protectli VP2420", price: "$220–280", tier: "Essential", specs: "4x 2.5GbE Intel NICs, 8GB RAM, 64GB eMMC", software: "pfSense CE or OPNsense", usedFor: "NAT, ACLs, IPsec/OpenVPN/WireGuard VPN, Suricata IDS/IPS, VLAN firewall zones, HAProxy", buy: "protectli.com / Amazon", covers: "CCNA 4.1, 5.5, 5.6 / CCNP 5.4" },
    { name: "Old x86 PC (2+ NICs)", price: "$0–50", tier: "Budget Alt", specs: "Any x86, 4GB+ RAM, 2 NICs", software: "pfSense CE or OPNsense", usedFor: "All same firewall/VPN labs as above — add $15 PCIe NIC card if needed", buy: "Facebook Marketplace", covers: "CCNA 5.x / CCNP 5.x" },
  ]},
  { category: "Wireless", icon: "◎", items: [
    { name: "Ubiquiti UniFi U6 Lite", price: "$90–110", tier: "Essential", specs: "WiFi 6 (802.11ax), 2x2 MIMO, PoE powered", software: "UniFi Network Controller (self-hosted)", usedFor: "Multiple SSIDs per VLAN, WPA3, WPA2-Enterprise/802.1X, WIPS, rogue AP detection, RF analysis", buy: "ui.com / Amazon", covers: "CCNA 1.10, 2.5, 2.6 / CCNP 3.7, 5.5" },
    { name: "Old Router (OpenWRT)", price: "$0–25", tier: "Lab Extra", specs: "Any supported — TP-Link Archer C7 etc.", software: "OpenWRT 23.x", usedFor: "VLAN tagging on WiFi, WDS bridging, custom QoS, ntopng traffic monitoring", buy: "Facebook Marketplace", covers: "CCNA 1.10, 2.6" },
  ]},
  { category: "Servers & Virtualization", icon: "▤", items: [
    { name: "Beelink EQ12 / S12 Pro", price: "$150–220", tier: "Essential", specs: "Intel N100, 16GB RAM, 500GB NVMe, 1x GbE", software: "Proxmox VE 8.x", usedFor: "Host all VMs: FRRouting (OSPF/BGP/MPLS), Windows Server, pfSense VMs, GNS3 server, EVE-NG, LXC containers", buy: "Amazon / AliExpress", covers: "CCNA 1.11 / CCNP 2.1, all routing labs" },
    { name: "Raspberry Pi 4 (4GB)", price: "$55–80", tier: "Essential", specs: "ARM A72, 4GB RAM, 1x GbE, 4x USB", software: "Raspberry Pi OS / DietPi", usedFor: "Pi-hole DNS, NTP server, monitoring node (Telegraf), FreeRADIUS, lightweight RADIUS/TACACS+", buy: "rpilocator.com / Adafruit", covers: "CCNA 4.3, 4.4, 5.4 / CCNP 5.1, 5.3" },
    { name: "Old Desktop PC (8GB+ RAM)", price: "$0–80", tier: "Budget Alt", specs: "Any x86, 8GB+ RAM", software: "Proxmox VE or EVE-NG bare metal", usedFor: "Extra VM host, or dedicated EVE-NG for CCNP routing simulation with multiple IOS VMs", buy: "Repurpose existing", covers: "All simulation labs" },
  ]},
  { category: "Monitoring & Management", icon: "◈", items: [
    { name: "USB Console Cable (FTDI)", price: "$10–15", tier: "Essential", specs: "USB-A to RJ45 rollover, FTDI chipset", software: "PuTTY / SecureCRT / minicom", usedFor: "Out-of-band CLI access to Cisco gear — required for initial config, IOS recovery, EEM testing", buy: "Amazon", covers: "All CCNA/CCNP Cisco labs" },
    { name: "8-Port GbE Unmanaged Switch", price: "$15–25", tier: "Essential", specs: "Any brand, GbE", software: "N/A", usedFor: "Expand management VLAN ports to connect all lab devices to management PC", buy: "Amazon / Walmart", covers: "Physical connectivity" },
    { name: "APC BE600M1 UPS", price: "$70–100", tier: "Recommended", specs: "600VA/330W, 7 outlets, USB monitoring", software: "apcupsd (Linux)", usedFor: "Protect Proxmox/gear from power loss. Graceful VM shutdown via apcupsd daemon.", buy: "Amazon / Best Buy", covers: "Lab reliability" },
  ]},
  { category: "Cabling & Physical", icon: "⬛", items: [
    { name: "Cat6 Patch Cables (10-pack)", price: "$15–25", tier: "Essential", specs: "Assorted 1ft/3ft/6ft lengths", software: "N/A", usedFor: "Lab interconnects. Cat6 supports 10GbE to 55m — future-proof for lab expansion.", buy: "Amazon (Monoprice)", covers: "All physical connectivity" },
    { name: "12U Open Frame Rack", price: "$60–120", tier: "Optional", specs: "Wall or floor mount", software: "N/A", usedFor: "Rack-mount switches and patch panel. Professional cable management makes troubleshooting faster.", buy: "Amazon / Navepoint", covers: "Lab organization" },
  ]},
];

// ─── SOFTWARE STACK ───────────────────────────────────────────────────────────
const softwareStack = [
  { name: "Proxmox VE", category: "Virtualization", description: "Type 1 hypervisor for KVM VMs and LXC containers. Hosts all routing VMs, Windows Server, etc.", url: "proxmox.com", covers: "CCNA 1.11 / CCNP 2.1" },
  { name: "FRRouting (FRR)", category: "Routing Suite", description: "Full routing daemon suite: OSPF, BGP, EIGRP, IS-IS, MPLS, BFD. Runs on Ubuntu VMs inside Proxmox.", url: "frrouting.org", covers: "CCNA 3.4 / CCNP 3.2–3.6" },
  { name: "GNS3 / EVE-NG", category: "Network Simulation", description: "Simulate Cisco IOS, JunOS, vEdge for DMVPN, SD-WAN, and MPLS labs not possible with real hardware.", url: "gns3.com", covers: "CCNP 1.2, 1.3, 3.6" },
  { name: "pfSense / OPNsense", category: "Firewall OS", description: "FreeBSD firewall with NAT, IPsec, OpenVPN, WireGuard, Suricata IDS/IPS, HAProxy.", url: "pfsense.org", covers: "CCNA 4.1, 5.5, 5.6 / CCNP 5.4" },
  { name: "FreeRADIUS + tac_plus", category: "AAA Services", description: "FreeRADIUS for 802.1X/EAP auth. tac_plus for TACACS+ device admin auth (CCNP 5.1).", url: "freeradius.org", covers: "CCNA 5.4 / CCNP 5.1, 5.3" },
  { name: "Pi-hole", category: "DNS", description: "Network DNS resolver and ad-block sinkhole. Add custom A/PTR records for all lab devices.", url: "pi-hole.net", covers: "CCNA 4.4" },
  { name: "LibreNMS", category: "Monitoring", description: "SNMP auto-discovery, bandwidth graphs, interface status, alerting for all lab devices.", url: "librenms.org", covers: "CCNA 4.5 / CCNP 4.4" },
  { name: "Grafana + InfluxDB", category: "Dashboards", description: "Visual dashboards for network metrics fed by Telegraf SNMP collector.", url: "grafana.com", covers: "CCNP 4.4" },
  { name: "Wireshark", category: "Packet Analysis", description: "Capture and analyze OSPF hellos, BGP updates, DHCP DORA, TCP handshakes, VXLAN encapsulation.", url: "wireshark.org", covers: "CCNA 1.5, 3.4 / CCNP 4.3" },
  { name: "Ansible + Netmiko", category: "Automation", description: "Ansible for IOS config pushes and backups. Netmiko/NAPALM for Python-driven CLI automation.", url: "ansible.com", covers: "CCNA 6.4 / CCNP 6.1, 6.2" },
  { name: "Graylog / ELK Stack", category: "Logging", description: "Centralized syslog collection from all network devices. Correlate events across the lab.", url: "graylog.org", covers: "CCNA 4.5 / CCNP 4.1" },
  { name: "Python (Netmiko/NAPALM/nornir)", category: "Scripting", description: "Python libraries for SSH-based automation. Parse JSON/XML/YANG from device APIs.", url: "netmiko.readthedocs.io", covers: "CCNA 6.x / CCNP 6.1–6.4" },
];

// ─── ROADMAP (exam-aligned) ───────────────────────────────────────────────────
const projects = [
  { week: "Weeks 1–2", phase: "Foundation & Fundamentals", color: "#00ff9d", examRef: "CCNA 1.x, 1.11, 1.12",
    tasks: [
      "Physical setup: rack/shelf all devices, run Cat6 cables, document topology in draw.io [CCNA 1.2]",
      "Configure VLANs on Cisco switch: 10=mgmt, 20=lab, 30=DMZ, 40=guest. Set trunk to router [CCNA 2.1, 2.2]",
      "Configure 802.1Q subinterfaces on router (router-on-a-stick) for inter-VLAN routing [CCNA 2.1]",
      "Install Proxmox VE on mini PC. Create vSwitch bridges mapped to each VLAN [CCNA 1.11]",
      "Spin up Ubuntu Server VM and Windows Server VM in Proxmox. Configure SSH key auth [CCNA 1.11]",
      "Verify IPv4 subnetting: assign /26, /25, /27 subnets to VLANs. Check ARP and MAC table [CCNA 1.6, 1.12]",
    ]
  },
  { week: "Weeks 3–4", phase: "Switching & STP", color: "#00d4ff", examRef: "CCNA 2.x / CCNP 3.1",
    tasks: [
      "Configure STP: manually set root bridge with priority 4096. Observe port roles (Root/Desg/Alt) [CCNA 2.4]",
      "Enable PortFast and BPDU Guard on all access ports. Test with plugging in a rogue switch [CCNA 2.4]",
      "Configure RSTP and compare convergence vs classic STP using timed ping test [CCNA 2.4 / CCNP 3.1]",
      "Configure MST (Multiple Spanning Tree) with 2 instances for different VLAN groups [CCNP 3.1]",
      "Build EtherChannel (LACP) between two switches. Verify with 'show etherchannel summary' [CCNA 2.3]",
      "Enable DHCP snooping, Dynamic ARP Inspection, and IP Source Guard on all VLANs [CCNA 5.3]",
    ]
  },
  { week: "Weeks 5–6", phase: "Routing Protocols — OSPF & EIGRP", color: "#ffd700", examRef: "CCNA 3.x / CCNP 3.2",
    tasks: [
      "Install FRRouting on Ubuntu VM. Configure single-area OSPFv2 between router and FRR VM [CCNA 3.4]",
      "Verify OSPF neighbor adjacency with 'show ip ospf neighbor'. Analyze LSAs in Wireshark [CCNA 3.4]",
      "Configure multi-area OSPF: Area 0 backbone, Area 1 stub, Area 2 NSSA. Add ABR summarization [CCNP 3.2]",
      "Configure OSPFv3 for IPv6 routing between VMs. Verify with 'show ipv6 ospf neighbor' [CCNP 3.8]",
      "Configure EIGRP on Cisco router (or GNS3). Observe topology table and feasible successors [CCNA 3.5]",
      "Practice route redistribution: OSPF into EIGRP and EIGRP into OSPF with metric tuning [CCNP 3.2]",
    ]
  },
  { week: "Weeks 7–8", phase: "BGP, MPLS & Advanced Routing", color: "#fb923c", examRef: "CCNP 3.2, 3.3, 3.5",
    tasks: [
      "Configure eBGP between two FRRouting VMs simulating two ASNs. Advertise lab prefixes [CCNP 3.3]",
      "Manipulate BGP path selection: set LOCAL_PREF, MED, AS-PATH prepend on different peers [CCNP 3.3]",
      "Configure BGP route filtering with prefix-lists and route-maps [CCNP 3.3]",
      "Configure MPLS with LDP on FRRouting VMs. Observe label forwarding table (LFIB) [CCNP 3.5]",
      "Configure VRF-Lite on MikroTik to isolate two customer routing tables [CCNP 2.2]",
      "Build GRE tunnel between two Linux VMs. Run OSPF inside the tunnel [CCNP 2.2, 3.6]",
    ]
  },
  { week: "Weeks 9–10", phase: "Firewall, VPN & Security", color: "#ff6b6b", examRef: "CCNA 5.x / CCNP 5.x",
    tasks: [
      "Deploy pfSense: configure NAT overload, VLAN firewall zones (LAN/DMZ/WAN/Guest) [CCNA 4.1, 5.6]",
      "Enable Suricata IDS/IPS on pfSense. Tune rules. Generate test alert traffic with curl [CCNA 5.6]",
      "Configure IPsec IKEv2 site-to-site VPN between two pfSense VMs in Proxmox [CCNA 5.5 / CCNP 5.4]",
      "Set up WireGuard remote access VPN. Test connectivity from phone/laptop off-network [CCNA 5.5]",
      "Configure extended ACLs: block DMZ→LAN, permit DMZ→Internet only on required ports [CCNA 5.2]",
      "Deploy FreeRADIUS + tac_plus. Configure TACACS+ for switch admin auth with privilege levels [CCNP 5.1]",
    ]
  },
  { week: "Weeks 11–12", phase: "Network Services & Wireless", color: "#c084fc", examRef: "CCNA 1.10, 2.5, 2.6, 4.x",
    tasks: [
      "Deploy Pi-hole as DNS for all VLANs. Add local A/PTR records for lab devices [CCNA 4.4]",
      "Configure DHCP server (Windows Server): scopes per VLAN, reservations, DHCP options (003, 006, 015) [CCNA 4.3]",
      "Set up NTP hierarchy: MikroTik as stratum 2, all VMs/switches sync to it. Verify with 'show ntp' [CCNA 4.2]",
      "Configure 802.1X port auth on switch with FreeRADIUS. Test with wpa_supplicant on Linux VM [CCNA 5.4 / CCNP 5.3]",
      "Configure UniFi AP: WPA3 SSID + WPA2-Enterprise SSID (802.1X to FreeRADIUS). Enable WIPS [CCNA 2.6 / CCNP 5.5]",
      "Configure SNMP v3 on all devices. Set up syslog forwarding to Graylog. Verify alerts [CCNA 4.5 / CCNP 4.1]",
    ]
  },
  { week: "Weeks 13–14", phase: "Monitoring & Network Assurance", color: "#00ff9d", examRef: "CCNP 4.x",
    tasks: [
      "Deploy LibreNMS: SNMP auto-discover all devices. Configure alerting rules (interface down, high CPU) [CCNP 4.4]",
      "Build Grafana dashboards fed by InfluxDB+Telegraf: bandwidth, latency, CPU per device [CCNP 4.4]",
      "Configure SPAN port on Cisco switch. Mirror traffic to Wireshark VM. Analyze OSPF/BGP/DHCP [CCNP 4.3]",
      "Configure IP SLA ICMP-echo probe on Cisco router. Tie tracking object to static route failover [CCNP 4.2]",
      "Write Cisco EEM applet to send syslog alert and notify on interface down event [CCNP 4.1]",
      "Configure VXLAN overlay between two Linux VMs. Capture and inspect VXLAN-encapsulated frames [CCNP 2.3]",
    ]
  },
  { week: "Weeks 15–16", phase: "Automation & Programmability", color: "#00d4ff", examRef: "CCNA 6.x / CCNP 6.x",
    tasks: [
      "Write Ansible inventory for all lab devices. Playbook to push VLAN configs to Cisco switch [CCNA 6.4 / CCNP 6.2]",
      "Write Ansible playbook to backup all running-configs nightly and commit to Git repo [CCNP 6.4]",
      "Python script with Netmiko: SSH to switch, pull 'show interfaces', parse output, export to CSV [CCNP 6.1]",
      "Python script using NAPALM to get device facts, BGP neighbors, and LLDP neighbors across lab [CCNP 6.1]",
      "Use MikroTik REST API with Python requests to get/set interface config. Parse JSON response [CCNA 6.3]",
      "Use RESTCONF to query Cisco IOS-XE (DevNet sandbox or GNS3). Parse YANG model with pyang [CCNP 6.3]",
    ]
  }
];

const STORAGE_KEY = "homelab_progress_v3";
function loadProgress() { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : {}; } catch { return {}; } }
function saveProgress(d) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {} }

export default function HomeLabGuide() {
  const [activeTab, setActiveTab] = useState("roadmap");
  const [expandedPhase, setExpandedPhase] = useState(0);
  const [expandedHW, setExpandedHW] = useState(null);
  const [progress, setProgress] = useState(loadProgress);
  const [examTab, setExamTab] = useState("ccna");
  const [expandedDomain, setExpandedDomain] = useState(null);

  useEffect(() => { saveProgress(progress); }, [progress]);

  const toggleTask = (pi, ti) => { const k=`${pi}-${ti}`; setProgress(p=>({...p,[k]:!p[k]})); };
  const getPhaseProgress = (pi) => {
    const total = projects[pi].tasks.length;
    const done = projects[pi].tasks.filter((_,ti)=>progress[`${pi}-${ti}`]).length;
    return { done, total, pct: Math.round((done/total)*100) };
  };
  const totalTasks = projects.reduce((a,p)=>a+p.tasks.length,0);
  const totalDone = Object.values(progress).filter(Boolean).length;
  const overallPct = Math.round((totalDone/totalTasks)*100);

  return (
    <div style={{ fontFamily:"'IBM Plex Mono','Courier New',monospace", background:"#070b0f", minHeight:"100vh", color:"#c8d8e8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Rajdhani:wght@500;700&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#0a0e14} ::-webkit-scrollbar-thumb{background:#1e3a2e;border-radius:2px}
        .hw-card:hover{border-color:#00ff9d44!important;background:#0d1a14!important}
        .task-row:hover{background:#0d1a20!important}
        .tb:hover{color:#aaccdd!important}
        .sw-chip:hover{border-color:#00d4ff55!important;background:#0a1520!important}
        .topic-row:hover{background:#0a1520!important}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
      `}</style>
      <div style={{ position:"fixed",top:0,left:0,right:0,height:"2px",background:"linear-gradient(transparent,#00ff9d22,transparent)",animation:"scan 8s linear infinite",pointerEvents:"none",zIndex:999 }}/>

      {/* HEADER */}
      <div style={{ background:"linear-gradient(180deg,#0a1a14 0%,#070b0f 100%)",borderBottom:"1px solid #00ff9d22",padding:"32px 24px 24px",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,opacity:.03,backgroundImage:"linear-gradient(#00ff9d 1px,transparent 1px),linear-gradient(90deg,#00ff9d 1px,transparent 1px)",backgroundSize:"32px 32px" }}/>
        <div style={{ position:"relative",maxWidth:980,margin:"0 auto" }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
            <div style={{ width:7,height:7,borderRadius:"50%",background:"#00ff9d",boxShadow:"0 0 10px #00ff9d",animation:"pulse 2s infinite" }}/>
            <span style={{ fontSize:10,letterSpacing:".25em",color:"#00ff9d88",textTransform:"uppercase" }}>SYS:HOMELAB_V3.0 // CCNA+CCNP ALIGNED</span>
          </div>
          <h1 style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:"clamp(28px,5vw,50px)",fontWeight:700,color:"#fff",margin:"0 0 4px",letterSpacing:".04em",lineHeight:1 }}>
            NETWORK ENGINEERING<br/><span style={{ color:"#00ff9d",textShadow:"0 0 30px #00ff9d44" }}>HOME LAB</span>
          </h1>
          <p style={{ margin:"0 0 20px",color:"#4a7a6a",fontSize:11,letterSpacing:".18em" }}>16-WEEK PLAN · CCNA 200-301 + CCNP ENCOR 350-401 MAPPED</p>
          <div style={{ maxWidth:500 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:11,color:"#4a7a6a",letterSpacing:".1em" }}>
              <span>OVERALL PROGRESS</span>
              <span style={{ color:"#00ff9d" }}>{totalDone}/{totalTasks} · {overallPct}%</span>
            </div>
            <div style={{ height:4,background:"#0f2018",borderRadius:2,overflow:"hidden" }}>
              <div style={{ height:"100%",width:`${overallPct}%`,background:"linear-gradient(90deg,#00ff9d,#00d4ff)",borderRadius:2,transition:"width .4s",boxShadow:overallPct>0?"0 0 8px #00ff9d66":"none" }}/>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ borderBottom:"1px solid #0f2018",background:"#070b0f",position:"sticky",top:0,zIndex:10 }}>
        <div style={{ maxWidth:980,margin:"0 auto",display:"flex",overflowX:"auto" }}>
          {[{id:"roadmap",label:"// Roadmap"},{id:"exams",label:"// Exam Topics"},{id:"hardware",label:"// Hardware"},{id:"software",label:"// Software"}].map(t=>(
            <button key={t.id} className="tb" onClick={()=>setActiveTab(t.id)} style={{ padding:"12px 20px",background:"none",border:"none",borderBottom:activeTab===t.id?"2px solid #00ff9d":"2px solid transparent",color:activeTab===t.id?"#00ff9d":"#3a5a4a",cursor:"pointer",fontSize:11,letterSpacing:".15em",fontFamily:"'IBM Plex Mono',monospace",transition:"color .2s",whiteSpace:"nowrap" }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:980,margin:"0 auto",padding:"24px 16px 60px" }}>

        {/* ── ROADMAP ── */}
        {activeTab==="roadmap" && (
          <div style={{ animation:"fadeIn .3s ease" }}>
            <p style={{ fontSize:12,color:"#3a5a4a",marginBottom:20,lineHeight:1.7 }}>Each task is tagged to the specific CCNA/CCNP exam objective it covers. Check off tasks as you complete them — progress saves in your browser.</p>
            {projects.map((phase,pi)=>{
              const {done,total,pct}=getPhaseProgress(pi);
              const isOpen=expandedPhase===pi;
              return (
                <div key={pi} style={{ marginBottom:8 }}>
                  <button onClick={()=>setExpandedPhase(isOpen?null:pi)} style={{ width:"100%",background:isOpen?"#0a1a14":"#080e0b",border:`1px solid ${isOpen?phase.color+"44":"#0f2018"}`,borderLeft:`3px solid ${done===total&&total>0?"#00ff9d":phase.color}`,borderRadius:isOpen?"4px 4px 0 0":"4px",padding:"13px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left",transition:"all .2s" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:10,flex:1,flexWrap:"wrap" }}>
                      <span style={{ fontSize:10,color:phase.color,letterSpacing:".12em",background:phase.color+"15",padding:"2px 8px",borderRadius:2,whiteSpace:"nowrap" }}>{phase.week}</span>
                      <span style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:16,color:"#ddeeff",fontWeight:700 }}>{phase.phase}</span>
                      <span style={{ fontSize:9,color:"#4a6a5a",background:"#0a1410",border:"1px solid #0f2018",padding:"2px 7px",borderRadius:2 }}>{phase.examRef}</span>
                      {done===total&&total>0&&<span style={{ fontSize:9,color:"#00ff9d",background:"#00ff9d15",padding:"2px 8px",borderRadius:2 }}>✓ DONE</span>}
                    </div>
                    <div style={{ display:"flex",alignItems:"center",gap:10,flexShrink:0 }}>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:10,color:pct===100?"#00ff9d":phase.color,marginBottom:3 }}>{done}/{total}</div>
                        <div style={{ width:70,height:3,background:"#0f2018",borderRadius:2 }}>
                          <div style={{ height:"100%",width:`${pct}%`,borderRadius:2,background:pct===100?"#00ff9d":phase.color,transition:"width .3s" }}/>
                        </div>
                      </div>
                      <span style={{ color:"#1e3a2e",fontSize:14,transition:"transform .2s",transform:isOpen?"rotate(90deg)":"none",display:"inline-block" }}>›</span>
                    </div>
                  </button>
                  {isOpen&&(
                    <div style={{ background:"#060a07",border:`1px solid ${phase.color}22`,borderTop:"none",borderRadius:"0 0 4px 4px",animation:"fadeIn .2s ease" }}>
                      {phase.tasks.map((task,ti)=>{
                        const k=`${pi}-${ti}`;const checked=!!progress[k];
                        const tag=task.match(/\[([^\]]+)\]$/);const clean=task.replace(/\s*\[[^\]]+\]$/,"");
                        return (
                          <div key={ti} className="task-row" onClick={()=>toggleTask(pi,ti)} style={{ display:"flex",alignItems:"flex-start",gap:10,padding:"12px 14px",borderBottom:ti<phase.tasks.length-1?"1px solid #0a1410":"none",cursor:"pointer",transition:"background .15s" }}>
                            <div style={{ width:15,height:15,border:`1.5px solid ${checked?phase.color:"#1e3a2e"}`,borderRadius:2,flexShrink:0,marginTop:2,background:checked?phase.color+"30":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s" }}>
                              {checked&&<span style={{ color:phase.color,fontSize:9,lineHeight:1 }}>✓</span>}
                            </div>
                            <div style={{ flex:1,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,flexWrap:"wrap" }}>
                              <span style={{ fontSize:12,color:checked?"#3a5a4a":"#aabbcc",lineHeight:1.6,textDecoration:checked?"line-through":"none",transition:"color .2s" }}>{clean}</span>
                              {tag&&<span style={{ fontSize:9,color:"#4a7a5a",background:"#0a1410",border:"1px solid #0f2018",padding:"2px 7px",borderRadius:2,whiteSpace:"nowrap",flexShrink:0 }}>{tag[1]}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── EXAM TOPICS ── */}
        {activeTab==="exams" && (
          <div style={{ animation:"fadeIn .3s ease" }}>
            <div style={{ display:"flex",gap:0,marginBottom:20,borderBottom:"1px solid #0f2018" }}>
              {[{id:"ccna",label:"CCNA 200-301",color:"#00ff9d"},{id:"ccnp",label:"CCNP ENCOR 350-401",color:"#ffd700"}].map(t=>(
                <button key={t.id} onClick={()=>{setExamTab(t.id);setExpandedDomain(null);}} style={{ padding:"10px 20px",background:"none",border:"none",borderBottom:examTab===t.id?`2px solid ${t.color}`:"2px solid transparent",color:examTab===t.id?t.color:"#3a5a4a",cursor:"pointer",fontSize:11,letterSpacing:".12em",fontFamily:"'IBM Plex Mono',monospace",transition:"color .2s" }}>{t.label}</button>
              ))}
            </div>

            {(examTab==="ccna"?ccnaDomains:ccnpDomains).map((dom,di)=>{
              const isOpen=expandedDomain===`${examTab}-${di}`;
              return (
                <div key={di} style={{ marginBottom:8 }}>
                  <button onClick={()=>setExpandedDomain(isOpen?null:`${examTab}-${di}`)} style={{ width:"100%",background:isOpen?"#0a1420":"#080e0b",border:`1px solid ${isOpen?dom.color+"44":"#0f2018"}`,borderLeft:`3px solid ${dom.color}`,borderRadius:isOpen?"4px 4px 0 0":"4px",padding:"13px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left",transition:"all .2s" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                      <span style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:15,color:"#ddeeff",fontWeight:700 }}>{dom.domain}</span>
                      <span style={{ fontSize:10,color:dom.color,background:dom.color+"15",padding:"2px 8px",borderRadius:2 }}>{dom.weight}</span>
                    </div>
                    <span style={{ color:"#1e3a2e",fontSize:14,transition:"transform .2s",transform:isOpen?"rotate(90deg)":"none",display:"inline-block" }}>›</span>
                  </button>
                  {isOpen&&(
                    <div style={{ background:"#060a0d",border:`1px solid ${dom.color}22`,borderTop:"none",borderRadius:"0 0 4px 4px",animation:"fadeIn .2s ease" }}>
                      {dom.topics.map((topic,ti)=>(
                        <div key={ti} className="topic-row" style={{ padding:"13px 14px",borderBottom:ti<dom.topics.length-1?"1px solid #0a1014":"none",transition:"background .15s" }}>
                          <div style={{ display:"flex",gap:10,alignItems:"flex-start",marginBottom:8 }}>
                            <span style={{ fontSize:10,color:dom.color,background:dom.color+"15",padding:"2px 7px",borderRadius:2,flexShrink:0,fontWeight:600 }}>{topic.id}</span>
                            <span style={{ fontSize:12,color:"#ccdde8",lineHeight:1.6 }}>{topic.text}</span>
                          </div>
                          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:8,paddingLeft:2 }}>
                            {[
                              {label:"LAB TASK",value:topic.lab,color:"#00ff9d"},
                              {label:"HARDWARE",value:topic.hw,color:"#00d4ff"},
                              {label:"SOFTWARE",value:topic.sw,color:"#ffd700"},
                            ].map(row=>(
                              <div key={row.label} style={{ background:"#0a1014",border:"1px solid #0f1a18",borderRadius:3,padding:"8px 10px" }}>
                                <div style={{ fontSize:9,color:row.color+"88",letterSpacing:".15em",marginBottom:4 }}>{row.label}</div>
                                <div style={{ fontSize:11,color:"#7a9aaa",lineHeight:1.5 }}>{row.value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── HARDWARE ── */}
        {activeTab==="hardware" && (
          <div style={{ animation:"fadeIn .3s ease" }}>
            <div style={{ background:"#080e0b",border:"1px solid #00ff9d18",borderLeft:"3px solid #00ff9d",borderRadius:4,padding:"13px 16px",marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12 }}>
              <div>
                <div style={{ fontSize:10,color:"#00ff9d88",letterSpacing:".2em",marginBottom:3 }}>ESTIMATED BUDGET (USED/REFURB)</div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:24,fontWeight:700,color:"#fff" }}>$700 – $1,100</div>
              </div>
              <div style={{ fontSize:12,color:"#3a5a4a",maxWidth:380,lineHeight:1.7 }}>Click any item to see full specs, software, what exam objectives it covers, and where to buy.</div>
            </div>
            {hardware.map((cat,ci)=>(
              <div key={ci} style={{ marginBottom:24 }}>
                <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
                  <span style={{ color:"#00ff9d",fontSize:14 }}>{cat.icon}</span>
                  <span style={{ fontSize:10,letterSpacing:".2em",textTransform:"uppercase",color:"#3a6a5a" }}>{cat.category}</span>
                  <div style={{ flex:1,height:1,background:"#0f2018" }}/>
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                  {cat.items.map((item,ii)=>{
                    const isOpen=expandedHW===`${ci}-${ii}`;
                    return (
                      <div key={ii} className="hw-card" onClick={()=>setExpandedHW(isOpen?null:`${ci}-${ii}`)} style={{ background:"#080e0b",border:"1px solid #0f2018",borderRadius:4,cursor:"pointer",transition:"all .2s",overflow:"hidden" }}>
                        <div style={{ padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12 }}>
                          <div style={{ display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0 }}>
                            <span style={{ fontSize:9,letterSpacing:".1em",padding:"2px 6px",borderRadius:2,flexShrink:0,background:item.tier==="Essential"?"#00ff9d18":item.tier==="Upgrade"?"#00d4ff18":"#ffffff10",color:item.tier==="Essential"?"#00ff9d":item.tier==="Upgrade"?"#00d4ff":"#667788",border:`1px solid ${item.tier==="Essential"?"#00ff9d25":item.tier==="Upgrade"?"#00d4ff25":"#ffffff15"}` }}>{item.tier}</span>
                            <span style={{ fontSize:14,color:"#ddeeff",fontWeight:600 }}>{item.name}</span>
                          </div>
                          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                            <span style={{ fontSize:12,color:"#00ff9d",background:"#00ff9d0f",padding:"3px 9px",borderRadius:3,whiteSpace:"nowrap",fontWeight:700 }}>{item.price}</span>
                            <span style={{ color:"#1e3a2e",fontSize:12,transition:"transform .2s",transform:isOpen?"rotate(90deg)":"none",display:"inline-block" }}>›</span>
                          </div>
                        </div>
                        {isOpen&&(
                          <div style={{ borderTop:"1px solid #0f2018",padding:"12px 14px",animation:"fadeIn .2s ease",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 16px" }}>
                            {[{label:"Specs",value:item.specs},{label:"Software",value:item.software},{label:"Used For",value:item.usedFor,full:true},{label:"Covers",value:item.covers,full:true},{label:"Buy From",value:item.buy}].map(row=>(
                              <div key={row.label} style={{ gridColumn:row.full?"1 / -1":"auto" }}>
                                <div style={{ fontSize:9,color:"#2a5a4a",letterSpacing:".15em",marginBottom:4 }}>{row.label.toUpperCase()}</div>
                                <div style={{ fontSize:12,color:"#8aacbc",lineHeight:1.6 }}>{row.value}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── SOFTWARE ── */}
        {activeTab==="software" && (
          <div style={{ animation:"fadeIn .3s ease" }}>
            <p style={{ fontSize:12,color:"#3a5a4a",marginBottom:20,lineHeight:1.7 }}>All free and open-source. Each tool is tagged to the CCNA/CCNP objectives it satisfies.</p>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:8 }}>
              {softwareStack.map((sw,i)=>(
                <div key={i} className="sw-chip" style={{ background:"#080e0b",border:"1px solid #0f2018",borderRadius:4,padding:"14px",transition:"all .2s" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6 }}>
                    <span style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:15,fontWeight:700,color:"#ddeeff" }}>{sw.name}</span>
                    <span style={{ fontSize:9,color:"#00d4ff88",background:"#00d4ff10",border:"1px solid #00d4ff20",padding:"2px 6px",borderRadius:2,whiteSpace:"nowrap",marginLeft:8 }}>{sw.category}</span>
                  </div>
                  <p style={{ fontSize:12,color:"#5a8a7a",margin:"0 0 8px",lineHeight:1.6 }}>{sw.description}</p>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <a href={`https://${sw.url}`} target="_blank" rel="noreferrer" style={{ fontSize:10,color:"#00ff9d55",letterSpacing:".08em",textDecoration:"none" }}>{sw.url} ↗</a>
                    <span style={{ fontSize:9,color:"#ffd70088",background:"#ffd70010",border:"1px solid #ffd70020",padding:"2px 6px",borderRadius:2 }}>{sw.covers}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:24,background:"#080d14",border:"1px solid #ffd70018",borderLeft:"3px solid #ffd700",borderRadius:4,padding:"16px 18px" }}>
              <div style={{ fontSize:10,letterSpacing:".2em",color:"#ffd70088",marginBottom:10 }}>RECOMMENDED INSTALL ORDER</div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:6,alignItems:"center" }}>
                {["Proxmox VE","pfSense/OPNsense","FRRouting","Pi-hole","Wireshark","FreeRADIUS+tac_plus","LibreNMS","Grafana+InfluxDB","Graylog","Ansible+Netmiko","GNS3/EVE-NG"].map((s,i,arr)=>(
                  <span key={s} style={{ display:"flex",alignItems:"center",gap:6 }}>
                    <span style={{ fontSize:11,color:"#8aacbc",background:"#0a1020",border:"1px solid #1a2a3a",padding:"3px 9px",borderRadius:3 }}>{s}</span>
                    {i<arr.length-1&&<span style={{ color:"#1e3a2e",fontSize:11 }}>→</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
