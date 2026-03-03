import Objective from "../assets/images/objective.jpg";
import Clearance from "../assets/images/clearance.jpg";
import nhrec from "../assets/images/nhrec.jpg";

function Home() {
  return (
    <main className="w-full">
      {/* Hero Section */}
      <section
        className="relative h-100 flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80')`,
        }}
      >
        <h1 className="text-white text-3xl md:text-4xl font-bold text-center px-4">
          Babcock University Health Research <br /> Ethics Committee (BUHREC)
        </h1>
      </section>

      {/* Our Objective Section */}
      <section className="py-16 px-10 md:px-20 grid md:grid-cols-2 gap-12 items-center bg-white">
        <img
          src={Objective}
          alt="Objective"
          className="rounded-lg shadow-md w-full h-64 object-cover"
        />
        <div>
          <h2 className="text-xl font-bold mb-4">OUR OBJECTIVE</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            The main objective of Babcock University Health Research Ethics
            Committee is to monitor, uphold and ensure that the quality of
            researches which emerges from Babcock University are of ethical
            standards thereby leading Babcock University to continuous and
            giving of world-class standards. This can be achieved by working
            together, helping, which is by working collaboratively.
          </p>
          <button className="bg-[#003399] text-white px-6 py-2 rounded text-sm font-semibold">
            View Full Objective
          </button>
        </div>
      </section>

      {/* NHREC Mission Section - Blue Background */}
      <section className="py-16 px-10 md:px-20 grid md:grid-cols-2 gap-12 items-center bg-[#003399] text-white">
        <div className="order-2 md:order-1">
          <h2 className="text-xl font-bold mb-4">NHREC MISSION</h2>
          <p className="leading-relaxed mb-6">
            BUHREC upholds and promotes the mission of the National Health
            Research Ethics Committee (NHREC).
          </p>
          <button className="bg-white text-[#003399] px-6 py-2 rounded text-sm font-semibold">
            View Full Mission
          </button>
        </div>
        <div className="order-1 md:order-2 flex justify-center">
          {/* Replace with actual NHREC logo */}
          <img
            src={nhrec}
            alt="nhrec_logo"
            className="rounded-lg shadow-md w-58 h-58 object-cover"
          />
        </div>
      </section>

      {/* Ethical Clearance Section */}
      <section className="py-16 px-10 md:px-20 grid md:grid-cols-2 gap-12 items-center bg-white">
        <img
          src={Clearance}
          alt="Ethical Clearance"
          className="rounded-lg shadow-md w-full h-64 object-cover"
        />
        <div>
          <h2 className="text-xl font-bold mb-4 uppercase">
            Ethical Clearance Requirements
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-sm">
            All BSc, MSc, MPhil, PhD, PGD and Independent research projects must
            obtain ethical clearance from the Babcock University Health Research
            Ethics Committee (BUHREC) before commencement. Submit a
            well-structured proposal with required sections, an endorsed
            application letter, plagiarism report, ethics approval form, and
            both hard and soft copies as specified. Careful guidelines and
            supervision needed.
          </p>
          <button className="bg-[#003399] text-white px-6 py-2 rounded text-sm font-semibold">
            View Requirements
          </button>
        </div>
      </section>
    </main>
  );
}

export default Home;
