ebase Config (same as patient side)
const firebaseConfig = {
  apiKey: "AIzaSyBlwEelUTnT7zOG1LWoQbGY-q12-E7jCsU",
  authDomain: "appointment-f502a.firebaseapp.com",
  projectId: "appointment-f502a",
  storageBucket: "appointment-f502a.firebasestorage.app",
  messagingSenderId: "1008851083630",
  appId: "1:1008851083630:web:0e2018ffa3fa66e1e8e17f",
  measurementId: "G-G7FTE4Y880"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const appointmentsContainer = document.getElementById("appointmentsContainer");
let jitsiApi = null;

// Fetch appointments in real-time
db.collection("appointments").orderBy("createdAt", "desc").onSnapshot(snapshot => {
  appointmentsContainer.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${data.name} (${data.age} yrs)</h3>
      <p><b>Problem:</b> ${data.problem}</p>
      <span class="badge slot">${data.timeSlot}</span>
      ${data.diabetic 
        ? '<span class="badge diabetic">Diabetic</span>' 
        : '<span class="badge healthy">Non-Diabetic</span>'}
      <button onclick="startCall('${data.name}')">Start Video Call</button>
    `;

    appointmentsContainer.appendChild(card);
  });
});

// Video Call Functions
function startCall(patientName) {
  const modal = document.getElementById("videoModal");
  modal.style.display = "flex";

  const domain = "meet.jit.si";
  const roomName = "Consult_" + patientName + "_" + Date.now(); // unique room
  const options = {
    roomName: roomName,
    width: "100%",
    height: 500,
    parentNode: document.getElementById("jitsi-container"),
    userInfo: {
      displayName: "Dr. Dashboard"
    }
  };
  jitsiApi = new JitsiMeetExternalAPI(domain, options);
}

function closeCall() {
  if (jitsiApi) {
    jitsiApi.dispose();
    jitsiApi = null;
  }
  document.getElementById("videoModal").style.display = "none";
}
