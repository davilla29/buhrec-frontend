import React from "react";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <div className="bg-white">
      <section className="h-[40vh] flex items-center justify-center bg-[#003B95]">
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-widest">
          Contact Us
        </h1>
      </section>

      <section className="py-20 px-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="p-8 bg-[#F8FAFC] rounded-2xl text-center space-y-4">
            <MapPin className="mx-auto text-[#003B95]" size={32} />
            <p className="text-sm font-bold text-gray-800">
              Room 109, 1st floor SAT Building, Babcock University
            </p>
          </div>
          <div className="p-8 bg-[#F8FAFC] rounded-2xl text-center space-y-4">
            <Phone className="mx-auto text-[#003B95]" size={32} />
            <p className="text-sm font-bold text-gray-800">09058096760</p>
          </div>
          <div className="p-8 bg-[#F8FAFC] rounded-2xl text-center space-y-4">
            <Mail className="mx-auto text-[#003B95]" size={32} />
            <p className="text-sm font-bold text-gray-800">buhrec@gmail.com</p>
          </div>
        </div>
        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-[#003B95] font-black uppercase text-sm tracking-widest hover:underline"
        >
          <ArrowLeft size={18} /> Back to Home
        </Link>
      </section>
    </div>
  );
};

export default Contact;
