import { useState, useEffect } from "react";

const ccnaLabs = [
  {
    domain: "1.0 Network Fundamentals", weight: "20%", color: "#00ff9d",
    labs: [
      { id:"1.1", objective:"Role/function of routers, L2/L3 switches, NGFWs, APs, controllers, endpoints, PoE", tasks:["Identify and label every device in your physical lab by function and OSI layer","Configure PoE on switch port for UniFi AP — verify with 'show power inline'","Connect Protectli firewall between ISP modem and lab switch as NGFW","Document which device operates at which OSI layer in your topology diagram"], hw:"Cisco 2960-X, MikroTik RB4011, Protectli pfSense, UniFi U6 Lite", sw:"Cisco IOS, RouterOS, pfSense" },
      { id:"1.2", objective:"Network topology architectures: 2-tier, 3-tier, spine-leaf, WAN, SOHO", tasks:["Draw your lab as a 2-tier (access + core) topology in draw.io","Label each tier and describe the role of every device in your diagram","Research spine-leaf and document how it differs from your 2-tier design","Identify which parts of your lab represent SOHO vs enterprise topology"], hw:"Switch + Router", sw:"draw.io (free)" },
      { id:"1.3", objective:"Physical interfaces: fiber types, copper cabling, SFP modules", tasks:["Cable all devices with Cat6 — identify straight-through vs crossover use cases","Research SFP/SFP+ modules for your switch fiber uplink ports","Document MDI/MDIX auto-detection behavior on Cisco switch ports"], hw:"Cat6 cables, Cisco 2960-X", sw:"N/A" },
      { id:"1.4", objective:"Interface and cable issues: collisions, errors, duplex/speed mismatch", tasks:["Set one switch port to half-duplex — observe errors with 'show interfaces'","Force speed mismatch (10Mbps vs 1Gbps) and document symptoms","Use 'show interfaces counters errors' to identify input/output drops and CRC errors"], hw:"Cisco 2960-X", sw:"Cisco IOS CLI" },
      { id:"1.5", objective:"Compare TCP vs UDP", tasks:["Capture a TCP 3-way handshake in Wireshark — identify SYN, SYN-ACK, ACK flags","Capture a DNS query over UDP — compare overhead vs TCP","Generate HTTP traffic and observe TCP retransmissions under packet loss"], hw:"Any PC", sw:"Wireshark" },
      { id:"1.6", objective:"Configure and verify IPv4 addressing and subnetting", tasks:["Subnet 10.0.0.0/22 into 4 VLANs — calculate network/broadcast/host ranges for each","Assign subnets: mgmt /26, lab /25, DMZ /27, guest /28","Verify end-to-end ping and traceroute between all VLANs"], hw:"Router + Switch", sw:"Cisco IOS / RouterOS" },
      { id:"1.7", objective:"Private IPv4 addressing (RFC 1918) and NAT overload", tasks:["Use 10.x.x.x throughout lab — verify no public IPs on internal interfaces","Configure PAT overload on pfSense for lab VLAN internet access","Verify NAT translations in pfSense States table — test with external curl"], hw:"Protectli pfSense box", sw:"pfSense / OPNsense" },
      { id:"1.8", objective:"IPv6 addressing, GUA/LLA/ULA, EUI-64, neighbor discovery", tasks:["Enable IPv6 on router interfaces — configure GUA and link-local addresses","Configure SLAAC on a VM — verify address derived from EUI-64","Capture IPv6 Neighbor Discovery in Wireshark: RS, RA, NS, NA messages"], hw:"MikroTik or Cisco router", sw:"RouterOS / IOS, Wireshark" },
      { id:"1.9", objective:"IPv4/IPv6 static routing: default, floating, summary", tasks:["Configure static default route pointing to pfSense WAN interface","Add floating static (AD 254) as backup — verify failover when primary is removed","Verify routing table with 'show ip route' — identify S, S* route entries"], hw:"Router", sw:"IOS / RouterOS" },
      { id:"1.10", objective:"Wireless: SSID, RF bands, encryption, AP modes, antenna types", tasks:["Configure separate SSIDs for lab, guest, and mgmt VLANs on UniFi AP","Set 2.4GHz to channel 6 and 5GHz to channel 36 — document why non-overlapping","Compare WPA2-Personal vs WPA2-Enterprise configuration in UniFi controller"], hw:"UniFi U6 Lite", sw:"UniFi Network Controller" },
      { id:"1.11", objective:"Virtualization: VMs, vSwitches, Type 1 vs Type 2 hypervisors", tasks:["Install Proxmox VE (Type 1). Create vSwitch bridges mapped to each VLAN ID","Deploy 4 VMs: Ubuntu Server, Windows Server, FRRouting, pfSense VM","Explain difference between Type 1 (Proxmox) and Type 2 (VirtualBox) with examples"], hw:"Beelink mini PC", sw:"Proxmox VE 8.x" },
      { id:"1.12", objective:"Switching: MAC address table, frame flooding, ARP, VLANs, trunks", tasks:["Observe MAC table building with 'show mac address-table dynamic'","Clear MAC table and send traffic — capture the resulting broadcast flood in Wireshark","Capture ARP request/reply — explain why ARP is broadcast and reply is unicast"], hw:"Cisco 2960-X", sw:"Cisco IOS, Wireshark" },
    ]
  },
  {
    domain: "2.0 Network Access", weight: "20%", color: "#00d4ff",
    labs: [
      { id:"2.1", objective:"VLANs and inter-VLAN routing (router-on-a-stick and L3 switch SVI)", tasks:["Create VLANs 10/20/30/40 on Cisco switch — assign access ports to each VLAN","Configure 802.1Q subinterfaces on router (router-on-a-stick) — verify inter-VLAN ping","Configure SVIs on L3 3560 switch as alternative — compare both methods"], hw:"Cisco 2960-X / 3560-CX, Router", sw:"Cisco IOS" },
      { id:"2.2", objective:"802.1Q trunking, DTP, native VLAN security", tasks:["Configure trunk between switch and router — verify with 'show interfaces trunk'","Disable DTP on all trunks with 'switchport nonegotiate' — explain security reason","Set native VLAN to unused VLAN 999 — document VLAN hopping risk and mitigation"], hw:"Cisco 2960-X", sw:"Cisco IOS" },
      { id:"2.3", objective:"EtherChannel: LACP, PAgP, static", tasks:["Bundle 2 ports between two switches with LACP (mode active both sides)","Verify with 'show etherchannel summary' — confirm SU flags on the port-channel","Shut down one member link — observe traffic continues on remaining link"], hw:"Two Cisco switches (or GNS3)", sw:"Cisco IOS" },
      { id:"2.4", objective:"STP: root bridge, port roles/states, RSTP, PortFast, BPDU Guard", tasks:["Manually set root bridge with 'spanning-tree vlan X priority 4096'","Enable PortFast + BPDU Guard on all access ports — test with a rogue switch plug-in","Force topology change — compare convergence time STP vs RSTP with timed ping"], hw:"Cisco 2960-X", sw:"Cisco IOS" },
      { id:"2.5", objective:"Cisco wireless: AP modes (local/flexconnect), WLC, CAPWAP", tasks:["Configure UniFi AP in standard controller-managed mode","Research CAPWAP — document control plane (mgmt) vs data plane (client traffic)","Compare standalone AP vs controller-managed in terms of config and roaming"], hw:"UniFi U6 Lite", sw:"UniFi Controller (Proxmox VM)" },
      { id:"2.6", objective:"Wireless security: WPA2, WPA3, 802.1X/EAP, PSK", tasks:["Configure WPA3-Personal SSID on UniFi — verify client connects with WPA3","Configure WPA2-Enterprise SSID pointing to FreeRADIUS for 802.1X auth","Test 802.1X auth with wpa_supplicant on Linux VM — verify RADIUS accept/reject"], hw:"UniFi U6 Lite, FreeRADIUS VM", sw:"FreeRADIUS, UniFi Controller, wpa_supplicant" },
    ]
  },
  {
    domain: "3.0 IP Connectivity", weight: "25%", color: "#ffd700",
    labs: [
      { id:"3.1", objective:"Components of routing table: prefix, mask, protocol, AD, metric, next-hop", tasks:["Run 'show ip route' — label every field in a route entry (AD/metric/next-hop/timestamp)","Compare administrative distances: OSPF 110, EIGRP 90, static 1, connected 0","Create two routes to same /24 with different ADs — confirm lower AD wins"], hw:"Router", sw:"Cisco IOS / RouterOS" },
      { id:"3.2", objective:"Routing decision: longest prefix match, AD tiebreaking, metric", tasks:["Create overlapping /24 and /28 routes to same area — verify /28 (LPM) wins","Test AD tiebreaker: same prefix via OSPF and static — confirm static wins","Configure equal-cost OSPF paths — verify load balancing across two next-hops"], hw:"Router + FRR VM", sw:"IOS / FRRouting" },
      { id:"3.3", objective:"Static routing: standard, default, floating, summary", tasks:["Configure floating static (AD 254) as WAN backup — verify failover by removing primary route","Configure summary static to aggregate /26 VLANs into one /22 advertisement","Configure IPv6 static and default routes — verify with 'show ipv6 route'"], hw:"Router", sw:"IOS / RouterOS" },
      { id:"3.4", objective:"Configure and verify single-area OSPFv2", tasks:["Configure OSPFv2 Area 0 between MikroTik router and FRRouting Ubuntu VM","Verify adjacency reaches FULL state in 'show ip ospf neighbor'","Capture OSPF Hello packets in Wireshark — identify Router-ID, Hello/Dead timers, area","Change OSPF reference bandwidth — observe cost recalculation on all interfaces"], hw:"MikroTik RB4011, Proxmox VM (FRR)", sw:"FRRouting on Ubuntu, Wireshark" },
      { id:"3.5", objective:"Configure and verify EIGRPv4: metrics, feasible successor, passive interface", tasks:["Configure EIGRP on Cisco router — verify neighbor table and topology table","Identify feasible successor: confirm FD > RD of successor in topology table","Configure passive interface on all LAN ports — verify EIGRP stops sending hellos there"], hw:"Cisco ISR router or GNS3", sw:"Cisco IOS / GNS3" },
    ]
  },
  {
    domain: "4.0 IP Services", weight: "10%", color: "#fb923c",
    labs: [
      { id:"4.1", objective:"NAT: static NAT, dynamic NAT, PAT/overload", tasks:["Configure PAT overload on pfSense for lab VLAN internet access — verify with curl","Add static NAT mapping a DMZ web server to a 'public' IP — test from outside","Inspect NAT state table in pfSense — identify inside local vs inside global addresses"], hw:"Protectli pfSense box", sw:"pfSense / OPNsense" },
      { id:"4.2", objective:"NTP: client/server, stratum levels, authentication", tasks:["Configure MikroTik as NTP server syncing to pool.ntp.org — verify stratum 2","Point all switches, routers, and VMs to MikroTik as NTP source","Verify with 'show ntp status' / 'ntpq -p' — confirm correct stratum and low offset"], hw:"MikroTik RB4011, all devices", sw:"RouterOS NTP, chrony/ntpd on Linux" },
      { id:"4.3", objective:"DHCP: server, relay agent, exclusions, DHCP options 003/006/015", tasks:["Configure DHCP scopes per VLAN on Windows Server — one scope per VLAN subnet","Configure DHCP relay (ip helper-address) on router subinterfaces — verify clients get IPs","Add DHCP options: 003 default gateway, 006 DNS server (Pi-hole), 015 domain name"], hw:"Proxmox VM (Windows Server 2022)", sw:"Windows Server DHCP" },
      { id:"4.4", objective:"DNS: A/AAAA/CNAME/PTR/MX records, local resolver", tasks:["Deploy Pi-hole as DNS resolver for all VLANs — set via DHCP option 006","Add custom A records for all lab devices (switch.lab, router.lab, proxmox.lab)","Add PTR reverse-lookup records — verify with 'dig -x <IP>' from a client VM"], hw:"Raspberry Pi 4", sw:"Pi-hole" },
      { id:"4.5", objective:"SNMP v2c/v3, syslog severity levels, debug vs show commands", tasks:["Configure SNMPv3 (authPriv) on Cisco switch — poll from LibreNMS with snmpwalk","Configure syslog forwarding (severity informational and below) to Graylog VM","Compare 'debug ip ospf' output vs 'show ip ospf' — document the difference"], hw:"Cisco switch, Proxmox VM", sw:"LibreNMS, Graylog" },
      { id:"4.6", objective:"QoS: DSCP, CoS, marking, policing, shaping, queuing", tasks:["Configure DSCP EF (46) marking for VoIP traffic class on MikroTik using mangle","Limit guest VLAN to 10Mbps with burst using MikroTik queue tree","Generate bulk traffic with iperf3 — observe marked VoIP traffic prioritized in queue"], hw:"MikroTik RB4011", sw:"RouterOS QoS/Mangle, iperf3" },
      { id:"4.7", objective:"SSH, TFTP/FTP/SCP for device management", tasks:["Disable Telnet on all Cisco devices — configure SSHv2 with RSA 2048-bit keys","Set up TFTP server on Ubuntu VM — back up all Cisco IOS configs via TFTP","Configure SCP on Cisco devices — test file transfer from management PC"], hw:"All devices, Ubuntu VM", sw:"OpenSSH, tftpd-hpa" },
    ]
  },
  {
    domain: "5.0 Security Fundamentals", weight: "15%", color: "#ff6b6b",
    labs: [
      { id:"5.1", objective:"Security concepts: CIA triad, threats, vulnerabilities, social engineering", tasks:["Document CIA triad analysis for your lab — identify risks on each VLAN","Research ARP spoofing, MAC flooding, VLAN hopping — document attack vectors","Set up test VM and run ARP spoofing with Scapy — capture in Wireshark to understand the attack"], hw:"Any VM", sw:"Scapy / arpspoof (testing only), Wireshark" },
      { id:"5.2", objective:"ACLs: standard, extended, named — IPv4 and IPv6", tasks:["Create extended named ACL blocking all traffic from guest VLAN to lab VLAN","Apply ACL inbound on guest VLAN subinterface — verify block with ping test","Create IPv6 ACL to restrict DMZ VM from management prefix access"], hw:"Cisco router", sw:"Cisco IOS" },
      { id:"5.3", objective:"Layer 2 security: DHCP snooping, DAI, IP source guard, port security", tasks:["Enable DHCP snooping on all VLANs — mark uplink trunk ports as trusted","Enable Dynamic ARP Inspection — run arpspoof on a VM and verify DAI drops it","Configure IP source guard on access ports — verify unknown MAC/IP pairs are dropped"], hw:"Cisco 2960-X", sw:"Cisco IOS, Scapy" },
      { id:"5.4", objective:"AAA with 802.1X port authentication and RADIUS", tasks:["Deploy FreeRADIUS on Proxmox — configure users with EAP-PEAP method","Configure 802.1X on Cisco switch access ports pointing to FreeRADIUS","Test with wpa_supplicant on Linux VM — verify authenticated vs unauthenticated port behavior"], hw:"Cisco 2960-X, Proxmox VM", sw:"FreeRADIUS, wpa_supplicant" },
      { id:"5.5", objective:"VPN types: IPsec site-to-site, remote access SSL VPN, GRE", tasks:["Configure IPsec IKEv2 site-to-site VPN between two pfSense VMs in Proxmox","Set up OpenVPN on pfSense for remote access — test from phone off-network","Configure GRE tunnel between two Linux VMs — run OSPF inside the GRE tunnel"], hw:"pfSense box, Proxmox VMs", sw:"pfSense, FRRouting" },
      { id:"5.6", objective:"Firewall: stateful inspection, zone-based policy, IPS/IDS", tasks:["Configure pfSense zones: LAN/DMZ/WAN/Guest with inter-zone firewall rules","Enable Suricata IDS in inline IPS mode on pfSense WAN interface","Generate test alert (curl testmyids.com) — verify Suricata detects and blocks it"], hw:"Protectli pfSense box", sw:"pfSense, Suricata" },
    ]
  },
  {
    domain: "6.0 Automation & Programmability", weight: "10%", color: "#c084fc",
    labs: [
      { id:"6.1", objective:"Automation impact, controller-based vs traditional, northbound/southbound APIs", tasks:["Manually configure 10 switch ports — time it. Then automate with Ansible — compare time","Research Cisco DNA Center API architecture — draw northbound/southbound diagram","Deploy EVE-NG and simulate an IOS-XE device to understand controller-based management"], hw:"Cisco switch, any PC", sw:"Ansible, EVE-NG" },
      { id:"6.2", objective:"SDN: data/control/management planes, Cisco DNA Center, SD-Access overview", tasks:["Run FRRouting and observe control plane (OSPF RIB) vs data plane (FIB) separately","Use Cisco DevNet Always-On sandbox to browse DNA Center API in Postman","Document SD-Access fabric roles: edge node, border node, control plane node"], hw:"Proxmox VMs", sw:"FRRouting, Postman, DevNet sandbox" },
      { id:"6.3", objective:"REST APIs: HTTP verbs, status codes, JSON/XML, authentication, Postman", tasks:["Use MikroTik REST API with curl: GET interface list, then PUT a new IP address","Write Python requests script to query pfSense REST API and export data as JSON","Use Postman to call Cisco IOS-XE RESTCONF API on DevNet Always-On sandbox"], hw:"MikroTik RB4011, any PC", sw:"Python, Postman, curl" },
      { id:"6.4", objective:"Configuration management: Ansible — inventory, playbooks, modules", tasks:["Write Ansible inventory with all lab devices grouped by type (switches, routers, linux)","Create Ansible playbook to configure VLANs 10/20/30/40 on Cisco switch via ios_config","Create Ansible playbook to backup running-configs of all devices to a Git repo"], hw:"Cisco switch, any PC", sw:"Ansible, Git" },
      { id:"6.5", objective:"Data formats: JSON, XML, YAML — structure, encoding, parsing", tasks:["Parse MikroTik REST API JSON output with Python — extract interface names and IPs","Write Python script converting YAML Ansible variable file to JSON — compare structure","Use jq CLI tool to filter and query a JSON response from a REST API call"], hw:"Any PC", sw:"Python, jq, PyYAML" },
    ]
  }
];

const ccnpLabs = [
  {
    domain: "1.0 Architecture", weight: "15%", color: "#00ff9d",
    labs: [
      { id:"1.1", objective:"Enterprise design: 2-tier/3-tier/fabric, HA, FHRP (HSRP/VRRP/GLBP), SSO, redundancy", tasks:["Configure HSRP between two FRR VMs for default gateway redundancy — set priorities 110/90","Verify HSRP active/standby roles — shut active interface and confirm standby takes over in <3s","Configure GLBP for load-balanced gateway — compare behavior to HSRP (all VMs use gateway)","Configure VRRP on MikroTik as alternative FHRP — compare HSRP vs VRRP feature differences","Document NSF/SSO concepts — research OSPF graceful restart and its role in HA"], hw:"Two FRR VMs on Proxmox, or MikroTik + FRR", sw:"FRRouting VRRP, RouterOS VRRP, Cisco IOS HSRP" },
      { id:"1.2", objective:"Cisco Catalyst SD-WAN: vEdge, vSmart, vBond, OMP, control/data planes, policies", tasks:["Deploy SD-WAN lab in EVE-NG with Cisco vEdge and vSmart controller images","Configure OMP peering between vEdge routers and vSmart controller","Build 2-branch SD-WAN topology — verify data plane IPsec tunnels form via BFD","Configure a simple SD-WAN policy: prefer MPLS for voice, internet for best-effort","Document vBond orchestration role and ZTP (Zero Touch Provisioning) process"], hw:"Proxmox VM running EVE-NG", sw:"EVE-NG Community, Cisco SD-WAN images (DevNet)" },
      { id:"1.3", objective:"Cisco SD-Access: LISP, VXLAN, ISE, fabric edge/border/control nodes", tasks:["Configure LISP map-server/map-resolver on FRRouting VMs — register EIDs","Configure VXLAN overlay between two Ubuntu VMs using iproute2","Capture VXLAN UDP frame in Wireshark — identify outer IP/UDP and inner Ethernet","Research ISE role in SD-Access — document policy enforcement via SGT + TrustSec","Document fabric roles: edge node (access), border node (external), control plane (LISP MS/MR)"], hw:"Proxmox FRR VMs, EVE-NG for full simulation", sw:"FRRouting LISP, iproute2 VXLAN, Wireshark" },
      { id:"1.4", objective:"QoS: MQC, DSCP/CoS, classification, CBWFQ, LLQ, policing, shaping, trust boundaries", tasks:["Configure MQC on Cisco router: class-map matching DSCP EF, policy-map with LLQ for VoIP","Configure CBWFQ: 30% BW to critical class, 10% to bulk, remaining to default","Apply traffic shaper on WAN interface — verify rate limiting with iperf3","Configure DSCP remarking at network edge — document trust boundary concept","Apply QoS policy on MikroTik using queue tree with DSCP classification"], hw:"Cisco ISR router (or GNS3), MikroTik RB4011", sw:"Cisco IOS MQC, RouterOS queue tree, iperf3" },
    ]
  },
  {
    domain: "2.0 Virtualization", weight: "10%", color: "#00d4ff",
    labs: [
      { id:"2.1", objective:"Hypervisor Type 1/2, VMs, containers, OVS, virtual switching, overlay networks", tasks:["Compare Proxmox VE (Type 1) vs VirtualBox (Type 2) — benchmark startup time and overhead","Install Open vSwitch (OVS) in Proxmox — create OVS bridge with VLAN tagging","Deploy LXC container alongside KVM VM — compare memory/CPU overhead and networking","Configure VLAN-aware bridge in Proxmox — verify VM receives tagged frames on trunk"], hw:"Beelink mini PC (Proxmox)", sw:"Proxmox VE, Open vSwitch, LXC" },
      { id:"2.2", objective:"VRF, VRF-Lite, GRE tunneling, IPsec tunnel mode, mGRE hub-spoke", tasks:["Configure VRF-Lite on MikroTik with two VRFs — verify 10.0.0.1 exists in both VRFs independently","Confirm VRF isolation: ping from VRF-A host cannot reach VRF-B host with same IP","Build GRE tunnel between two FRRouting VMs — run OSPF inside the tunnel","Configure mGRE hub-spoke in GNS3 as foundation for DMVPN Phase 1","Configure IPsec tunnel mode on pfSense — verify encrypted traffic with Wireshark"], hw:"MikroTik RB4011, Proxmox FRR VMs, GNS3", sw:"RouterOS VRF, FRRouting, GNS3" },
      { id:"2.3", objective:"Network virtualization: LISP, VXLAN data plane, BGP EVPN control plane", tasks:["Configure VXLAN bridge between two Ubuntu VMs with iproute2 'ip link add vxlan'","Capture VXLAN frame in Wireshark — identify outer UDP 4789, VNI, and inner Ethernet","Configure BGP EVPN on FRRouting VMs — verify MAC/IP route advertisement in BGP table","Document LISP EID (endpoint) vs RLOC (locator) and mapping to SD-Access fabric","Configure BGP EVPN symmetric IRB — verify inter-VNI routing between two VXLAN segments"], hw:"Proxmox FRR VMs", sw:"FRRouting BGP EVPN, iproute2, Wireshark" },
    ]
  },
  {
    domain: "3.0 Infrastructure", weight: "30%", color: "#ffd700",
    labs: [
      { id:"3.1", objective:"L2: MST, UDLD, storm control, port security, 802.1Q, EtherChannel, loop protection", tasks:["Configure MST with 2 instances: Instance 1 for VLANs 10-20, Instance 2 for VLANs 30-40","Set different root bridges per MST instance — verify per-instance load balancing","Configure storm control: 20% broadcast, 10% multicast thresholds on access ports","Configure UDLD aggressive mode on all switch-to-switch fiber uplinks","Implement port security sticky MAC on access ports — test violation shutdown action"], hw:"Cisco 2960-X / 3560-CX", sw:"Cisco IOS" },
      { id:"3.2", objective:"OSPFv2/v3: multi-area, LSA types 1-7, area types, ABR summarization, authentication, virtual links", tasks:["Configure multi-area OSPF: Area 0 backbone, Area 1 stub, Area 2 NSSA, Area 3 totally-stubby","Configure ABR summarization — verify prefix count reduction in non-zero areas","Configure OSPF MD5 authentication between all OSPF neighbors","Configure OSPF virtual link to reconnect a discontiguous Area 0 segment","Configure OSPFv3 for IPv6 — verify dual-stack routing alongside OSPFv2","Run 'show ip ospf database' — identify Type 1, 2, 3, 5, 7 LSAs and their roles"], hw:"Router + 3x FRR VMs on Proxmox", sw:"FRRouting, Cisco IOS, Wireshark" },
      { id:"3.3", objective:"BGP: eBGP/iBGP, path attributes, best-path selection algorithm, filtering, communities, RR", tasks:["Configure eBGP between two FRR VMs (AS65001 and AS65002) — advertise lab prefixes","Influence path with LOCAL_PREF 200 on preferred uplink, 100 on backup","Configure AS-PATH prepending to make one path appear longer and less preferred","Apply route-map adding community 65001:100 — filter with community-list on peer","Configure iBGP full mesh between 3 routers in same AS — observe need for full mesh","Configure BGP Route Reflector — verify RR-client can learn routes without full mesh","Set up BGP prefix filtering with prefix-list — verify only permitted routes accepted"], hw:"3x FRR VMs on Proxmox", sw:"FRRouting BGP" },
      { id:"3.4", objective:"EIGRP: named mode, composite metric, DUAL algorithm, stub, summarization, authentication", tasks:["Configure EIGRP named mode on Cisco router — compare config structure to classic mode","Observe DUAL: create topology change and verify fast convergence via feasible successor","Configure EIGRP stub router on spoke — verify it only advertises connected/summary routes","Configure EIGRP MD5 authentication between all EIGRP peers","Configure manual summary route at boundary — verify reduction in query scope"], hw:"Cisco ISR router or GNS3 with IOS images", sw:"Cisco IOS / GNS3" },
      { id:"3.5", objective:"MPLS: label switching, LDP, LFIB, L3VPN (VRF, RD, RT, MP-BGP PE-CE)", tasks:["Enable MPLS and LDP on FRRouting VMs — verify label exchange: 'show mpls ldp neighbor'","Trace label-switched path with 'show mpls forwarding-table' — identify label operations","Configure MPLS L3VPN: PE-CE routing with VRF, RD uniqueness, RT import/export","Connect two 'customer' sites via L3VPN — verify traffic isolated with overlapping IPs","Capture MPLS-labeled frames in Wireshark — identify EXP bits and label stack"], hw:"3x FRR VMs on Proxmox", sw:"FRRouting MPLS, LDP, MP-BGP" },
      { id:"3.6", objective:"DMVPN Phase 1/2/3, NHRP, mGRE, FlexVPN IKEv2, spoke-to-spoke tunnels", tasks:["Build DMVPN Phase 1 in GNS3 — verify all spokes register with hub via NHRP","Upgrade to Phase 2 — trigger spoke-to-spoke NHRP resolution and verify direct tunnel","Run OSPF over DMVPN hub-and-spoke — configure network type broadcast on hub","Build Phase 3 DMVPN — verify route summarization at hub enables spoke-to-spoke","Build FlexVPN IKEv2 site-to-site in GNS3 — compare to DMVPN architecture"], hw:"GNS3 with Cisco IOS images", sw:"GNS3, Cisco IOS 15.x images" },
      { id:"3.7", objective:"Wireless 802.11ax: OFDMA, MU-MIMO, BSS Coloring, roaming 802.11r/k/v, WMM QoS", tasks:["Scan RF environment in UniFi — identify co-channel interference and adjust channel plan","Configure 802.11r Fast BSS Transition — test roaming latency between two APs","Configure WMM QoS — map DSCP EF to AC_VO (voice) queue on SSID","Enable BSS Transition (802.11v) — test client roaming steering","Document WiFi 6 features: OFDMA, MU-MIMO, TWT — compare to 802.11ac (WiFi 5)"], hw:"UniFi U6 Lite (WiFi 6)", sw:"UniFi Network Controller" },
      { id:"3.8", objective:"IPv6: routing, DHCPv6, RA Guard, 6in4/6to4 tunnels, OSPFv3, transition mechanisms", tasks:["Configure DHCPv6 stateful server — assign addresses and DNS options to IPv6 clients","Configure RA Guard on Cisco switch to block rogue Router Advertisement attacks","Build 6in4 static tunnel to connect IPv6 island across IPv4 lab network","Configure OSPFv3 for IPv6 routing — verify adjacency and prefix table","Configure dual-stack router — verify IPv4 (OSPF) and IPv6 (OSPFv3) run simultaneously"], hw:"Router + Proxmox VMs", sw:"FRRouting OSPFv3, Cisco IOS IPv6, RouterOS" },
    ]
  },
  {
    domain: "4.0 Network Assurance", weight: "10%", color: "#fb923c",
    labs: [
      { id:"4.1", objective:"Diagnose with SNMP, syslog, EEM applets, debug, Cisco IOS event management", tasks:["Configure EEM applet to detect interface down event and send custom syslog alert","Write EEM applet that automatically re-enables a port after error-disabled shutdown","Configure buffered logging at debug level — analyze logs during OSPF adjacency flap","Use 'debug ip ospf adj' during neighbor formation — document each message exchange","Configure EEM to run 'show interfaces' automatically when utilization exceeds threshold"], hw:"Cisco switch/router", sw:"Cisco IOS EEM, Graylog" },
      { id:"4.2", objective:"IP SLA: ICMP-echo, UDP-jitter, HTTP probes, threshold actions, tracking objects", tasks:["Configure IP SLA ICMP-echo probe monitoring default gateway — set frequency 10s","Tie IP SLA tracking object to floating static route — verify failover on probe failure","Configure UDP-jitter probe to measure latency/jitter to a server — set MOS threshold","Configure IP SLA HTTP GET probe monitoring a DMZ web server — alert on timeout","Use 'show ip sla statistics' to read probe results and verify threshold violations"], hw:"Cisco router", sw:"Cisco IOS IP SLA" },
      { id:"4.3", objective:"SPAN, RSPAN, ERSPAN, NetFlow/IPFIX, Wireshark deep packet analysis", tasks:["Configure SPAN on Cisco switch — mirror VLAN 20 traffic to Proxmox analysis VM","Configure RSPAN — mirror traffic across two switches to a centralized analyzer VM","Set up NetFlow v9 export from MikroTik to ntopng — visualize top talkers by IP","Analyze full TCP session in Wireshark: capture → find → follow TCP stream","Analyze complete OSPF adjacency in Wireshark: identify Hello, DBD, LSR, LSU, LSAck"], hw:"Cisco 2960-X, Proxmox VM", sw:"Wireshark, ntopng, LibreNMS" },
      { id:"4.4", objective:"Network monitoring: SNMP polling, streaming telemetry, gNMI, Grafana dashboards", tasks:["Deploy LibreNMS — SNMP auto-discover all lab devices, configure per-device dashboards","Configure gNMI streaming telemetry from IOS-XE (DevNet sandbox) to Telegraf","Build Grafana dashboard showing: interface Mbps, BGP peer state, OSPF neighbor count","Configure LibreNMS alert: email when interface utilization exceeds 80% for 5 minutes","Compare SNMP polling (pull) vs streaming telemetry (push) — document latency difference"], hw:"Proxmox VM or Raspberry Pi", sw:"LibreNMS, Grafana, InfluxDB, Telegraf" },
    ]
  },
  {
    domain: "5.0 Security", weight: "20%", color: "#ff6b6b",
    labs: [
      { id:"5.1", objective:"Device hardening: AAA, TACACS+, RBAC, privilege levels, local fallback, CoPP, login protection", tasks:["Deploy tac_plus TACACS+ server on Proxmox VM with user/group config","Configure Cisco switch: 'aaa authentication login default group tacacs+ local'","Create RBAC: privilege 5 for NOC read-only, privilege 15 for network admin","Test local fallback by stopping tac_plus — verify local credentials still work","Configure 'login block-for 60 attempts 5 within 30' to block brute-force SSH"], hw:"Cisco switch/router, Proxmox VM", sw:"tac_plus, Cisco IOS AAA" },
      { id:"5.2", objective:"Network security: CoPP, uRPF, iACL, SNMPv3, DHCP snooping, DAI, IP source guard", tasks:["Configure Control Plane Policing (CoPP): rate-limit ICMP to 100pps, SSH to 100pps","Configure uRPF strict mode on edge interfaces — test with spoofed source packet","Create infrastructure ACL (iACL) blocking external access to device management IPs","Remove all SNMPv2 community strings — replace with SNMPv3 authPriv users","Combine DHCP snooping + DAI + IP source guard in one VLAN — test all three together"], hw:"Cisco router, Cisco 2960-X", sw:"Cisco IOS" },
      { id:"5.3", objective:"802.1X with ISE, TrustSec SGT, MACsec, MAB, Change of Authorization (CoA)", tasks:["Configure 802.1X on Cisco switch with RADIUS auth to FreeRADIUS","Configure RADIUS CoA — dynamically change VLAN assignment post-authentication","Configure MAB (MAC Auth Bypass) for printer/IoT devices that don't support 802.1X","Research SGT — configure static SGT assignment on switch ports","Enable MACsec on a switch-to-switch uplink — capture encrypted frames in Wireshark"], hw:"Cisco 2960-X, Proxmox FreeRADIUS VM", sw:"FreeRADIUS, wpa_supplicant, Cisco IOS" },
      { id:"5.4", objective:"VPN: DMVPN, FlexVPN IKEv2, IPsec, GET VPN concepts, SSL VPN", tasks:["Configure IKEv2 IPsec between pfSense and FRRouting VM — verify crypto session output","Build DMVPN Phase 2 in GNS3 with IKEv2 protection — verify spoke-to-spoke shortcut","Configure OpenVPN with certificate-based authentication on pfSense","Research GET VPN group key encryption — document difference from point-to-point IPsec","Configure split tunneling on OpenVPN — only lab subnets go through VPN"], hw:"pfSense box, GNS3, FRR VMs", sw:"pfSense VPN, GNS3 IOS, FRRouting" },
      { id:"5.5", objective:"Wireless security: WPA3, EAP-TLS, WIPS, rogue AP, management frame protection (802.11w)", tasks:["Enable 802.11w (Management Frame Protection) on all SSIDs in UniFi controller","Configure WIPS in UniFi — enable rogue AP detection and observe alerts","Generate self-signed certs with OpenSSL — configure EAP-TLS on FreeRADIUS","Test WPA2-Enterprise with EAP-TLS (certificate-based) vs EAP-PEAP (password-based)","Document EAP-PEAP vs EAP-TLS vs EAP-TTLS security comparison"], hw:"UniFi U6 Lite, Proxmox FreeRADIUS VM", sw:"FreeRADIUS, OpenSSL, UniFi Controller" },
    ]
  },
  {
    domain: "6.0 Automation", weight: "15%", color: "#c084fc",
    labs: [
      { id:"6.1", objective:"Python: Netmiko, NAPALM, nornir, Scrapli for network automation", tasks:["Write Netmiko script to SSH into Cisco switch — pull 'show interfaces' and parse into dict","Use NAPALM get_interfaces() and get_bgp_neighbors() across all lab devices simultaneously","Build nornir inventory with all devices — run 'show version' in parallel and compare speed","Use Scrapli for SSH connection — benchmark connection speed vs Netmiko with 10 devices","Write Python script that detects any interface with error rate >0 and emails alert"], hw:"All lab devices, any PC", sw:"Python, Netmiko, NAPALM, nornir, Scrapli" },
      { id:"6.2", objective:"Ansible: playbooks, roles, inventory, ios_config, napalm modules, AWX, Vault", tasks:["Build Ansible inventory with groups: cisco_switches, mikrotik_routers, linux_vms, proxmox","Create role-based playbooks: roles/vlans, roles/ntp, roles/snmp, roles/backup","Use ios_config module to push VLAN config — use napalm_install_config for MikroTik","Deploy AWX (Ansible Tower) in Proxmox — schedule nightly config backup job","Implement Ansible Vault to encrypt device passwords in group_vars/all/vault.yml"], hw:"All lab devices, Proxmox VM (AWX)", sw:"Ansible, AWX, Ansible Vault, Git" },
      { id:"6.3", objective:"RESTCONF, NETCONF, YANG models, pyang, OpenConfig, ncclient", tasks:["Use RESTCONF GET to retrieve running config from Cisco IOS-XE (DevNet Always-On sandbox)","Use NETCONF with Python ncclient library — get and edit device config with RPC calls","Install pyang — generate tree view of Cisco YANG model: 'pyang -f tree Cisco-IOS-XE-native.yang'","Write Python RESTCONF script to configure an interface IP address via PUT method","Use Postman to test RESTCONF PATCH — update BGP neighbor description without full replace"], hw:"DevNet Always-On sandbox, any PC", sw:"Python ncclient, pyang, Postman, requests" },
      { id:"6.4", objective:"Git, CI/CD pipelines, infrastructure as code, config validation, GitOps workflow", tasks:["Store all lab device configs in Git — implement main/dev/feature branch strategy","Create GitHub Actions workflow: on push to main, run Ansible-lint on all playbooks","Write pytest tests that SSH to devices and verify NTP server is configured correctly","Implement GitOps: merge to main branch triggers Ansible deployment to lab automatically","Set up pre-commit hooks: yamllint, ansible-lint, check for hardcoded credentials in YAML"], hw:"Any PC", sw:"Git, GitHub Actions, Ansible-lint, pytest, pre-commit" },
    ]
  }
];

const hardware = [
  { category:"Core Routing & Switching", icon:"⬡", items:[
    { name:"Cisco Catalyst 2960-X", price:"$40–90", tier:"Essential", specs:"48x GbE, 2x SFP+, PoE+", software:"Cisco IOS 15.x", usedFor:"VLANs, STP/RSTP/MST, EtherChannel, DHCP snooping, DAI, port security, 802.1X, CoPP, SPAN, UDLD, storm control", buy:"eBay", covers:"CCNA 2.x, 5.3 / CCNP 3.1, 4.3, 5.1–5.3" },
    { name:"Cisco 3560-CX (Layer 3)", price:"$60–120", tier:"Upgrade", specs:"12x GbE, 2x SFP+, full L3 IP Services", software:"Cisco IOS IP Services", usedFor:"Inter-VLAN SVI routing, OSPF, MQC QoS, UDLD, MST — great for CCNP switching depth", buy:"eBay", covers:"CCNA 2.1 / CCNP 3.1, 3.2" },
    { name:"MikroTik RB4011", price:"$120–160", tier:"Essential", specs:"10x GbE, 1x SFP+, ARM quad-core, 1GB RAM", software:"RouterOS v7", usedFor:"BGP, OSPF, MPLS, VRF-Lite, GRE, VRRP/HSRP, QoS mangle, REST API, DHCP/DNS server", buy:"mikrotik.com / Amazon", covers:"CCNA 3.x, 4.x, 6.x / CCNP 1.1, 2.2, 3.3" },
    { name:"Cisco ISR 1841 / 2801", price:"$25–50", tier:"Budget Alt", specs:"2x WAN, 2x LAN, WIC module slots", software:"Cisco IOS 12.4/15.x", usedFor:"EIGRP, OSPF, IOS EEM, IP SLA, DMVPN, IPsec, HSRP, CoPP, TACACS+, MQC QoS", buy:"eBay", covers:"CCNA 3–5 / CCNP 1.1, 3.4, 3.6, 4.1, 4.2, 5.1" },
  ]},
  { category:"Firewall / Security", icon:"▣", items:[
    { name:"Protectli VP2420", price:"$220–280", tier:"Essential", specs:"4x 2.5GbE Intel NICs, 8GB RAM, 64GB eMMC", software:"pfSense CE or OPNsense", usedFor:"NAT/PAT, IPsec IKEv2, OpenVPN, WireGuard, Suricata IDS/IPS, zone-based firewall, HAProxy", buy:"protectli.com / Amazon", covers:"CCNA 4.1, 5.5, 5.6 / CCNP 5.4" },
    { name:"Old x86 PC (2+ NICs)", price:"$0–50", tier:"Budget Alt", specs:"Any x86, 4GB+ RAM, 2+ NICs", software:"pfSense CE or OPNsense", usedFor:"All firewall and VPN labs — add $15 PCIe Intel NIC if only 1 NIC available", buy:"Facebook Marketplace / r/homelabsales", covers:"CCNA 5.x / CCNP 5.x" },
  ]},
  { category:"Wireless", icon:"◎", items:[
    { name:"Ubiquiti UniFi U6 Lite", price:"$90–110", tier:"Essential", specs:"WiFi 6 (802.11ax), 2x2 MIMO, PoE 802.3af", software:"UniFi Network Controller", usedFor:"Multi-SSID/VLAN, WPA3, WPA2-Enterprise 802.1X, WIPS, rogue AP detection, 802.11r/k/v roaming, WMM QoS", buy:"ui.com / Amazon", covers:"CCNA 1.10, 2.5, 2.6 / CCNP 3.7, 5.5" },
  ]},
  { category:"Servers & Virtualization", icon:"▤", items:[
    { name:"Beelink EQ12 / S12 Pro", price:"$150–220", tier:"Essential", specs:"Intel N100, 16GB RAM, 500GB NVMe, 1x 2.5GbE", software:"Proxmox VE 8.x", usedFor:"Host all VMs: FRRouting, Windows Server, pfSense VMs, AWX, Graylog, Grafana, FreeRADIUS, tac_plus", buy:"Amazon / AliExpress", covers:"CCNA 1.11 / CCNP 2.1, all routing labs" },
    { name:"Raspberry Pi 4 (4GB)", price:"$55–80", tier:"Essential", specs:"ARM A72, 4GB RAM, 1x GbE, microSD", software:"Raspberry Pi OS / DietPi", usedFor:"Pi-hole DNS, NTP server, FreeRADIUS, Telegraf monitoring agent, lightweight services", buy:"rpilocator.com / Adafruit", covers:"CCNA 4.2–4.4, 5.4 / CCNP 5.1, 5.3" },
    { name:"Old Desktop PC", price:"$0–80", tier:"Budget Alt", specs:"Any x86, 8GB+ RAM recommended", software:"Proxmox VE or EVE-NG bare metal", usedFor:"Dedicated EVE-NG host for SD-WAN, DMVPN, and Cisco IOS-based CCNP simulations", buy:"Repurpose existing", covers:"CCNP 1.2, 1.3, 3.6" },
  ]},
  { category:"Monitoring & Management", icon:"◈", items:[
    { name:"USB Console Cable (FTDI)", price:"$10–15", tier:"Essential", specs:"USB-A to RJ45 rollover, FTDI chipset", software:"PuTTY / SecureCRT / minicom", usedFor:"Out-of-band CLI to all Cisco gear — required for initial setup, password recovery, EEM testing", buy:"Amazon", covers:"All Cisco labs" },
    { name:"8-Port GbE Unmanaged Switch", price:"$15–25", tier:"Essential", specs:"Any brand GbE", software:"N/A", usedFor:"Expand management VLAN ports — connect management PC and all devices simultaneously", buy:"Amazon / Walmart", covers:"Physical connectivity" },
    { name:"APC BE600M1 UPS", price:"$70–100", tier:"Recommended", specs:"600VA/330W, 7 outlets, USB monitoring", software:"apcupsd daemon", usedFor:"Protect Proxmox and switches from power loss — graceful VM shutdown via apcupsd", buy:"Amazon / Best Buy", covers:"Lab reliability" },
  ]},
  { category:"Cabling & Physical", icon:"⬛", items:[
    { name:"Cat6 Patch Cables (10-pack)", price:"$15–25", tier:"Essential", specs:"Assorted 1ft/3ft/6ft", software:"N/A", usedFor:"All lab interconnects — Cat6 supports 10GbE to 55m, future-proofs expansion", buy:"Amazon (Monoprice)", covers:"All physical connectivity" },
    { name:"12U Open Frame Rack", price:"$60–120", tier:"Optional", specs:"Wall-mount or floor-standing", software:"N/A", usedFor:"Professional cable management — makes the lab look clean and simplifies troubleshooting", buy:"Amazon / Navepoint", covers:"Lab organization" },
  ]},
];

const softwareStack = [
  { name:"Proxmox VE", cat:"Virtualization", desc:"Type 1 hypervisor for KVM VMs and LXC containers. Foundation of the entire virtual lab.", url:"proxmox.com", ccna:"1.11", ccnp:"2.1" },
  { name:"FRRouting (FRR)", cat:"Routing Suite", desc:"Full routing daemon: OSPFv2/v3, BGP, EIGRP, IS-IS, MPLS, LDP, BFD, EVPN. Runs on Ubuntu VMs.", url:"frrouting.org", ccna:"3.4", ccnp:"3.2–3.5" },
  { name:"GNS3 / EVE-NG", cat:"Network Simulation", desc:"Simulate Cisco IOS, SD-WAN vEdge/vSmart for DMVPN, FlexVPN, and SD-WAN labs.", url:"gns3.com", ccna:"—", ccnp:"1.2, 1.3, 3.6" },
  { name:"pfSense / OPNsense", cat:"Firewall OS", desc:"FreeBSD firewall: NAT, IPsec IKEv2, OpenVPN, WireGuard, Suricata IDS/IPS, HAProxy.", url:"pfsense.org", ccna:"4.1, 5.5, 5.6", ccnp:"5.4" },
  { name:"FreeRADIUS + tac_plus", cat:"AAA Services", desc:"FreeRADIUS for 802.1X/EAP/CoA. tac_plus for TACACS+ device admin with RBAC and privilege levels.", url:"freeradius.org", ccna:"5.4", ccnp:"5.1, 5.3" },
  { name:"Pi-hole", cat:"DNS Resolver", desc:"Network DNS resolver and ad sinkhole. Custom A/AAAA/PTR records for all lab devices.", url:"pi-hole.net", ccna:"4.4", ccnp:"—" },
  { name:"LibreNMS", cat:"Monitoring", desc:"SNMP auto-discovery, bandwidth graphs, BGP peer state, interface status, alerting.", url:"librenms.org", ccna:"4.5", ccnp:"4.4" },
  { name:"Grafana + InfluxDB", cat:"Dashboards", desc:"Visual dashboards fed by Telegraf SNMP/gNMI. Streaming telemetry visualization.", url:"grafana.com", ccna:"—", ccnp:"4.4" },
  { name:"Wireshark", cat:"Packet Analysis", desc:"Capture OSPF hellos, BGP updates, DHCP DORA, VXLAN frames, MPLS labels, EAP exchanges.", url:"wireshark.org", ccna:"1.5, 3.4", ccnp:"2.3, 4.3" },
  { name:"Ansible + AWX", cat:"Automation", desc:"Ansible for config push and backup. AWX for scheduled jobs, RBAC audit trails, and GitOps.", url:"ansible.com", ccna:"6.4", ccnp:"6.2" },
  { name:"Python (Netmiko/NAPALM/nornir)", cat:"Scripting", desc:"SSH automation. NAPALM for multi-vendor abstraction. nornir for parallel task execution.", url:"netmiko.readthedocs.io", ccna:"6.3", ccnp:"6.1" },
  { name:"Graylog / ELK Stack", cat:"Logging", desc:"Centralized syslog from all devices. Correlate EEM events, OSPF flaps, and auth failures.", url:"graylog.org", ccna:"4.5", ccnp:"4.1" },
];

const STORAGE_KEY = "homelab_v4";
function loadP() { try { const r=localStorage.getItem(STORAGE_KEY); return r?JSON.parse(r):{}; } catch { return {}; } }
function saveP(d) { try { localStorage.setItem(STORAGE_KEY,JSON.stringify(d)); } catch {} }

export default function App() {
  const [tab, setTab] = useState("ccna");
  const [page, setPage] = useState("labs");
  const [openDomain, setOpenDomain] = useState(null);
  const [openLab, setOpenLab] = useState(null);
  const [openHW, setOpenHW] = useState(null);
  const [progress, setProgress] = useState(loadP);

  useEffect(()=>{ saveP(progress); },[progress]);
  const toggle = (k) => setProgress(p=>({...p,[k]:!p[k]}));

  const domPct = (labs, di, ek) => {
    let t=0,d=0;
    labs.forEach((l,li)=>l.tasks.forEach((_,ti)=>{ t++; if(progress[`${ek}-${di}-${li}-${ti}`]) d++; }));
    return { done:d, total:t, pct:t?Math.round((d/t)*100):0 };
  };
  const examPct = (domains, ek) => {
    let t=0,d=0;
    domains.forEach((dom,di)=>dom.labs.forEach((l,li)=>l.tasks.forEach((_,ti)=>{ t++; if(progress[`${ek}-${di}-${li}-${ti}`]) d++; })));
    return { done:d, total:t, pct:t?Math.round((d/t)*100):0 };
  };

  const ccnaP = examPct(ccnaLabs,"ccna");
  const ccnpP = examPct(ccnpLabs,"ccnp");
  const totDone = ccnaP.done+ccnpP.done, totTotal = ccnaP.total+ccnpP.total;
  const totPct = Math.round((totDone/totTotal)*100);
  const activeDomains = tab==="ccna" ? ccnaLabs : ccnpLabs;
  const activeP = tab==="ccna" ? ccnaP : ccnpP;

  return (
    <div style={{ fontFamily:"'IBM Plex Mono','Courier New',monospace",background:"#070b0f",minHeight:"100vh",color:"#c8d8e8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Rajdhani:wght@600;700&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#0a0e14} ::-webkit-scrollbar-thumb{background:#1e3a2e;border-radius:2px}
        .row:hover{background:#0d1820!important} .hwc:hover{border-color:#00ff9d44!important;background:#0d1a14!important}
        .tb:hover{color:#aaccdd!important} .swc:hover{border-color:#00d4ff44!important;background:#0a1520!important}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes fi{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
        @keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
      `}</style>
      <div style={{ position:"fixed",top:0,left:0,right:0,height:"2px",background:"linear-gradient(transparent,#00ff9d22,transparent)",animation:"scan 8s linear infinite",pointerEvents:"none",zIndex:999 }}/>

      {/* HEADER */}
      <div style={{ background:"linear-gradient(180deg,#0a1a14,#070b0f)",borderBottom:"1px solid #00ff9d22",padding:"26px 20px 20px",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,opacity:.03,backgroundImage:"linear-gradient(#00ff9d 1px,transparent 1px),linear-gradient(90deg,#00ff9d 1px,transparent 1px)",backgroundSize:"32px 32px" }}/>
        <div style={{ position:"relative",maxWidth:980,margin:"0 auto" }}>
          <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:5 }}>
            <div style={{ width:6,height:6,borderRadius:"50%",background:"#00ff9d",boxShadow:"0 0 8px #00ff9d",animation:"pulse 2s infinite" }}/>
            <span style={{ fontSize:9,letterSpacing:".22em",color:"#00ff9d55",textTransform:"uppercase" }}>HOMELAB_V4.0 // CCNA + CCNP EXAM-ALIGNED</span>
          </div>
          <h1 style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:"clamp(24px,4.5vw,44px)",fontWeight:700,color:"#fff",margin:"0 0 4px",letterSpacing:".04em",lineHeight:1 }}>
            NETWORK ENGINEERING <span style={{ color:"#00ff9d",textShadow:"0 0 24px #00ff9d44" }}>HOME LAB</span>
          </h1>
          <p style={{ margin:"0 0 14px",color:"#3a6a5a",fontSize:10,letterSpacing:".16em" }}>CCNA 200-301 · CCNP ENCOR 350-401 · ALL LABS EXAM-MAPPED</p>
          <div style={{ maxWidth:460,marginBottom:14 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:3,fontSize:9,color:"#3a6a5a",letterSpacing:".1em" }}>
              <span>TOTAL PROGRESS</span><span style={{ color:"#00ff9d" }}>{totDone}/{totTotal} · {totPct}%</span>
            </div>
            <div style={{ height:3,background:"#0f2018",borderRadius:2,overflow:"hidden" }}>
              <div style={{ height:"100%",width:`${totPct}%`,background:"linear-gradient(90deg,#00ff9d,#00d4ff)",borderRadius:2,transition:"width .4s" }}/>
            </div>
          </div>
          <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
            {[{label:"CCNA 200-301",p:ccnaP,color:"#00ff9d"},{label:"CCNP ENCOR 350-401",p:ccnpP,color:"#ffd700"}].map(e=>(
              <div key={e.label} style={{ background:"#0a1410",border:`1px solid ${e.color}20`,borderRadius:4,padding:"7px 12px",display:"flex",alignItems:"center",gap:10 }}>
                <div>
                  <div style={{ fontSize:9,color:e.color,letterSpacing:".1em",marginBottom:2 }}>{e.label}</div>
                  <div style={{ width:120,height:2,background:"#0f2018",borderRadius:2 }}>
                    <div style={{ height:"100%",width:`${e.p.pct}%`,background:e.color,borderRadius:2,transition:"width .4s" }}/>
                  </div>
                </div>
                <span style={{ fontSize:11,color:e.color,fontWeight:700 }}>{e.p.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NAV */}
      <div style={{ borderBottom:"1px solid #0f2018",background:"#070b0f",position:"sticky",top:0,zIndex:10 }}>
        <div style={{ maxWidth:980,margin:"0 auto",display:"flex",overflowX:"auto" }}>
          {[
            {id:"labs-ccna",label:"// CCNA Labs",active:page==="labs"&&tab==="ccna"},
            {id:"labs-ccnp",label:"// CCNP Labs",active:page==="labs"&&tab==="ccnp"},
            {id:"hardware",label:"// Hardware",active:page==="hardware"},
            {id:"software",label:"// Software",active:page==="software"},
          ].map(t=>(
            <button key={t.id} className="tb" onClick={()=>{ if(t.id==="hardware"){setPage("hardware");} else if(t.id==="software"){setPage("software");} else{ setPage("labs"); setTab(t.id==="labs-ccna"?"ccna":"ccnp"); setOpenDomain(null); setOpenLab(null); }}} style={{ padding:"11px 16px",background:"none",border:"none",borderBottom:t.active?"2px solid #00ff9d":"2px solid transparent",color:t.active?"#00ff9d":"#3a5a4a",cursor:"pointer",fontSize:10,letterSpacing:".14em",fontFamily:"'IBM Plex Mono',monospace",transition:"color .2s",whiteSpace:"nowrap" }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:980,margin:"0 auto",padding:"20px 14px 60px" }}>

        {/* LABS PAGE */}
        {page==="labs"&&(
          <div style={{ animation:"fi .3s ease" }}>
            <div style={{ background:"#080e0b",border:`1px solid ${tab==="ccna"?"#00ff9d18":"#ffd70018"}`,borderLeft:`3px solid ${tab==="ccna"?"#00ff9d":"#ffd700"}`,borderRadius:4,padding:"11px 14px",marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8 }}>
              <div>
                <div style={{ fontSize:9,color:tab==="ccna"?"#00ff9d77":"#ffd70077",letterSpacing:".18em",marginBottom:2 }}>{tab==="ccna"?"CCNA 200-301 — 6 DOMAINS — 120 MIN EXAM":"CCNP ENCOR 350-401 — 6 DOMAINS — 120 MIN EXAM"}</div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:17,fontWeight:700,color:"#fff" }}>{activeP.done}/{activeP.total} tasks complete · {activeP.pct}%</div>
              </div>
              <div style={{ fontSize:11,color:"#3a5a4a",maxWidth:340,lineHeight:1.7 }}>
                {tab==="ccna"?"Each domain covers a CCNA exam objective. Expand a domain, open a lab, check off tasks as you complete them.":"Labs build on CCNA skills. Includes BGP, MPLS, SD-WAN, DMVPN, streaming telemetry, and full automation pipelines."}
              </div>
            </div>

            {activeDomains.map((dom,di)=>{
              const dp=domPct(dom.labs,di,tab);
              const dk=`${tab}-d${di}`;
              const isDomOpen=openDomain===dk;
              return (
                <div key={di} style={{ marginBottom:7 }}>
                  <button onClick={()=>setOpenDomain(isDomOpen?null:dk)} style={{ width:"100%",background:isDomOpen?"#0a1a14":"#080e0b",border:`1px solid ${isDomOpen?dom.color+"44":"#0f2018"}`,borderLeft:`3px solid ${dp.pct===100?"#00ff9d":dom.color}`,borderRadius:isDomOpen?"4px 4px 0 0":"4px",padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left",transition:"all .2s" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:10,flex:1,flexWrap:"wrap" }}>
                      <span style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:15,color:"#ddeeff",fontWeight:700 }}>{dom.domain}</span>
                      <span style={{ fontSize:9,color:dom.color,background:dom.color+"15",padding:"2px 7px",borderRadius:2 }}>{dom.weight}</span>
                      {dp.pct===100&&<span style={{ fontSize:8,color:"#00ff9d",background:"#00ff9d15",padding:"2px 6px",borderRadius:2 }}>✓ COMPLETE</span>}
                    </div>
                    <div style={{ display:"flex",alignItems:"center",gap:8,flexShrink:0 }}>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:9,color:dp.pct===100?"#00ff9d":dom.color,marginBottom:2 }}>{dp.done}/{dp.total}</div>
                        <div style={{ width:60,height:2,background:"#0f2018",borderRadius:2 }}>
                          <div style={{ height:"100%",width:`${dp.pct}%`,borderRadius:2,background:dp.pct===100?"#00ff9d":dom.color,transition:"width .3s" }}/>
                        </div>
                      </div>
                      <span style={{ color:"#1e3a2e",fontSize:13,transition:"transform .2s",transform:isDomOpen?"rotate(90deg)":"none",display:"inline-block" }}>›</span>
                    </div>
                  </button>

                  {isDomOpen&&(
                    <div style={{ background:"#060a07",border:`1px solid ${dom.color}22`,borderTop:"none",borderRadius:"0 0 4px 4px",animation:"fi .2s ease" }}>
                      {dom.labs.map((lab,li)=>{
                        const lk=`${tab}-d${di}-l${li}`;
                        const isLabOpen=openLab===lk;
                        const labDone=lab.tasks.filter((_,ti)=>progress[`${tab}-${di}-${li}-${ti}`]).length;
                        return (
                          <div key={li} style={{ borderBottom:li<dom.labs.length-1?"1px solid #0a1410":"none" }}>
                            <div className="row" onClick={()=>setOpenLab(isLabOpen?null:lk)} style={{ padding:"10px 12px",cursor:"pointer",display:"flex",alignItems:"flex-start",gap:9,transition:"background .15s" }}>
                              <span style={{ fontSize:9,color:dom.color,background:dom.color+"18",padding:"2px 6px",borderRadius:2,flexShrink:0,marginTop:2,fontWeight:700 }}>{lab.id}</span>
                              <div style={{ flex:1 }}>
                                <div style={{ fontSize:12,color:"#ccdde8",lineHeight:1.5,marginBottom:5 }}>{lab.objective}</div>
                                <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                                  <span style={{ fontSize:9,color:"#3a6a4a",background:"#0a1410",border:"1px solid #0f1a14",padding:"2px 6px",borderRadius:2 }}>HW: {lab.hw}</span>
                                  <span style={{ fontSize:9,color:"#3a5a6a",background:"#0a1018",border:"1px solid #0f1820",padding:"2px 6px",borderRadius:2 }}>SW: {lab.sw}</span>
                                </div>
                              </div>
                              <div style={{ display:"flex",alignItems:"center",gap:7,flexShrink:0 }}>
                                <span style={{ fontSize:9,color:labDone===lab.tasks.length?"#00ff9d":dom.color }}>{labDone}/{lab.tasks.length}</span>
                                <span style={{ color:"#1e3a2e",fontSize:11,transition:"transform .2s",transform:isLabOpen?"rotate(90deg)":"none",display:"inline-block" }}>›</span>
                              </div>
                            </div>
                            {isLabOpen&&(
                              <div style={{ background:"#040708",borderTop:"1px solid #0a1410",animation:"fi .15s ease" }}>
                                {lab.tasks.map((task,ti)=>{
                                  const tk=`${tab}-${di}-${li}-${ti}`;
                                  const checked=!!progress[tk];
                                  return (
                                    <div key={ti} className="row" onClick={()=>toggle(tk)} style={{ display:"flex",alignItems:"flex-start",gap:9,padding:"9px 12px 9px 34px",borderBottom:ti<lab.tasks.length-1?"1px solid #080d0b":"none",cursor:"pointer",transition:"background .15s" }}>
                                      <div style={{ width:13,height:13,border:`1.5px solid ${checked?dom.color:"#1e3a2e"}`,borderRadius:2,flexShrink:0,marginTop:2,background:checked?dom.color+"28":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s" }}>
                                        {checked&&<span style={{ color:dom.color,fontSize:8,lineHeight:1 }}>✓</span>}
                                      </div>
                                      <span style={{ fontSize:11,color:checked?"#3a5a4a":"#99bbcc",lineHeight:1.6,textDecoration:checked?"line-through":"none",transition:"color .2s" }}>{task}</span>
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
                </div>
              );
            })}
          </div>
        )}

        {/* HARDWARE PAGE */}
        {page==="hardware"&&(
          <div style={{ animation:"fi .3s ease" }}>
            <div style={{ background:"#080e0b",border:"1px solid #00ff9d18",borderLeft:"3px solid #00ff9d",borderRadius:4,padding:"11px 14px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10 }}>
              <div>
                <div style={{ fontSize:9,color:"#00ff9d77",letterSpacing:".18em",marginBottom:2 }}>ESTIMATED BUDGET (USED / REFURB)</div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:22,fontWeight:700,color:"#fff" }}>$700 – $1,100</div>
              </div>
              <div style={{ fontSize:11,color:"#3a5a4a",maxWidth:360,lineHeight:1.7 }}>Click any item for specs, exam coverage, and where to buy. eBay + r/homelabsales cuts costs 40–60%.</div>
            </div>
            {hardware.map((cat,ci)=>(
              <div key={ci} style={{ marginBottom:20 }}>
                <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:8 }}>
                  <span style={{ color:"#00ff9d",fontSize:13 }}>{cat.icon}</span>
                  <span style={{ fontSize:9,letterSpacing:".18em",textTransform:"uppercase",color:"#3a6a5a" }}>{cat.category}</span>
                  <div style={{ flex:1,height:1,background:"#0f2018" }}/>
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:5 }}>
                  {cat.items.map((item,ii)=>{
                    const isOpen=openHW===`${ci}-${ii}`;
                    return (
                      <div key={ii} className="hwc" onClick={()=>setOpenHW(isOpen?null:`${ci}-${ii}`)} style={{ background:"#080e0b",border:"1px solid #0f2018",borderRadius:4,cursor:"pointer",transition:"all .2s",overflow:"hidden" }}>
                        <div style={{ padding:"10px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:9 }}>
                          <div style={{ display:"flex",alignItems:"center",gap:9,flex:1,minWidth:0 }}>
                            <span style={{ fontSize:8,padding:"2px 5px",borderRadius:2,flexShrink:0,background:item.tier==="Essential"?"#00ff9d18":item.tier==="Upgrade"?"#00d4ff18":"#ffffff10",color:item.tier==="Essential"?"#00ff9d":item.tier==="Upgrade"?"#00d4ff":"#667788",border:`1px solid ${item.tier==="Essential"?"#00ff9d20":item.tier==="Upgrade"?"#00d4ff20":"#ffffff10"}` }}>{item.tier}</span>
                            <span style={{ fontSize:13,color:"#ddeeff",fontWeight:600 }}>{item.name}</span>
                          </div>
                          <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                            <span style={{ fontSize:11,color:"#00ff9d",background:"#00ff9d0f",padding:"2px 8px",borderRadius:3,whiteSpace:"nowrap",fontWeight:700 }}>{item.price}</span>
                            <span style={{ color:"#1e3a2e",fontSize:11,transition:"transform .2s",transform:isOpen?"rotate(90deg)":"none",display:"inline-block" }}>›</span>
                          </div>
                        </div>
                        {isOpen&&(
                          <div style={{ borderTop:"1px solid #0f2018",padding:"11px 12px",animation:"fi .2s ease",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"9px 14px" }}>
                            {[{l:"Specs",v:item.specs},{l:"Software",v:item.software},{l:"Used For",v:item.usedFor,full:true},{l:"Exam Coverage",v:item.covers,full:true},{l:"Buy From",v:item.buy}].map(r=>(
                              <div key={r.l} style={{ gridColumn:r.full?"1/-1":"auto" }}>
                                <div style={{ fontSize:8,color:"#2a5a4a",letterSpacing:".15em",marginBottom:3 }}>{r.l.toUpperCase()}</div>
                                <div style={{ fontSize:11,color:"#8aacbc",lineHeight:1.6 }}>{r.v}</div>
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

        {/* SOFTWARE PAGE */}
        {page==="software"&&(
          <div style={{ animation:"fi .3s ease" }}>
            <p style={{ fontSize:11,color:"#3a5a4a",marginBottom:16,lineHeight:1.7 }}>All free and open-source. Each tool is tagged to the CCNA and CCNP objectives it covers.</p>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:7 }}>
              {softwareStack.map((sw,i)=>(
                <div key={i} className="swc" style={{ background:"#080e0b",border:"1px solid #0f2018",borderRadius:4,padding:"13px",transition:"all .2s" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5 }}>
                    <span style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:14,fontWeight:700,color:"#ddeeff" }}>{sw.name}</span>
                    <span style={{ fontSize:8,color:"#00d4ff88",background:"#00d4ff10",border:"1px solid #00d4ff18",padding:"2px 5px",borderRadius:2,whiteSpace:"nowrap",marginLeft:7 }}>{sw.cat}</span>
                  </div>
                  <p style={{ fontSize:11,color:"#5a8a7a",margin:"0 0 9px",lineHeight:1.6 }}>{sw.desc}</p>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:4 }}>
                    <a href={`https://${sw.url}`} target="_blank" rel="noreferrer" style={{ fontSize:9,color:"#00ff9d33",textDecoration:"none" }}>{sw.url} ↗</a>
                    <div style={{ display:"flex",gap:3 }}>
                      {sw.ccna!=="—"&&<span style={{ fontSize:8,color:"#00ff9d77",background:"#00ff9d0f",border:"1px solid #00ff9d18",padding:"2px 5px",borderRadius:2 }}>CCNA {sw.ccna}</span>}
                      {sw.ccnp!=="—"&&<span style={{ fontSize:8,color:"#ffd70077",background:"#ffd7000f",border:"1px solid #ffd70018",padding:"2px 5px",borderRadius:2 }}>CCNP {sw.ccnp}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
