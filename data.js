// EDIT THIS FILE ONLY. Put pictures in images/ and match the paths below.
// Empty image/src values intentionally show the accessible camera placeholder.
window.ECE_DATA = {
  department: "Electronics Engineering Department",
  headline: "Every ECE research, searchable.",
  tagline: "Browse the studies, awards, and yearly expo showcases from our students and faculty.",
  footer: "Sample entries shown. Edit data.js to add your own.",
  logo: "images/logo.png",

  research: [
    { year: 2026, title: "Solar-Powered IoT Soil Monitor", students: "Sample Team A", adviser: "Engr. Adviser 1", field: "IoT", abstract: "A low-power sensor node that reports soil moisture and temperature for small farms.", image: "", featured: true },
    { year: 2026, title: "Low-Cost Smart Energy Meter", students: "Sample Team B", adviser: "Engr. Adviser 2", field: "Power Electronics", abstract: "An accessible energy monitor designed to help households understand daily consumption.", image: "", featured: true },
    { year: 2025, title: "LoRa Mesh for Flood Warning", students: "Sample Team C", adviser: "Engr. Adviser 1", field: "Communications", abstract: "A resilient long-range network for sending early warning messages during heavy rain.", image: "", featured: true },
    { year: 2025, title: "Gesture-Controlled Wheelchair", students: "Sample Team D", adviser: "Engr. Adviser 3", field: "Embedded Systems", abstract: "", image: "" },
    { year: 2024, title: "Automated PCB Defect Inspector", students: "Sample Team E", adviser: "Engr. Adviser 2", field: "Instrumentation", abstract: "", image: "" },
    { year: 2024, title: "Line-Following Warehouse Robot", students: "Sample Team F", adviser: "Engr. Adviser 3", field: "Robotics", abstract: "", image: "" },
    { year: 2023, title: "RFID Library Attendance System", students: "Sample Team G", adviser: "Engr. Adviser 1", field: "Embedded Systems", abstract: "", image: "" },
    { year: 2022, title: "Air Quality Sensor Network", students: "Sample Team H", adviser: "Engr. Adviser 3", field: "IoT", abstract: "", image: "" }
  ],

  achievements: [
    { year: 2025, title: "Best Research Paper", event: "Regional engineering research conference", image: "images/achievements/best-paper.jpg" },
    { year: 2024, title: "Champion, Innovation Challenge", event: "National student electronics contest", image: "" },
    { year: 2023, title: "Best Poster Presentation", event: "Inter-school research forum", image: "" }
  ],

  expo: [
    { year: 2026, summary: "Annual ECE Research Exposition. Pick a year to see its photos.", photos: [
      { src: "", caption: "Opening program" }, { src: "", caption: "Project booths" }, { src: "", caption: "Awarding ceremony" } ] },
    { year: 2025, summary: "Student teams presented practical electronics solutions for resilient communities.", photos: [ { src: "", caption: "Prototype demonstrations" } ] },
    { year: 2024, summary: "", photos: [] },
    { year: 2023, summary: "", photos: [] },
    { year: 2022, summary: "", photos: [] }
  ]
};
