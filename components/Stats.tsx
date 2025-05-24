"use client";

import { motion } from "framer-motion";
import { Users, Map, Award, ThumbsUp } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
  {
    icon: Users,
    value: 5000,
    label: "Happy Travelers",
    suffix: "+"
  },
  {
    icon: Map,
    value: 50,
    label: "Unique Tours",
    suffix: "+"
  },
  {
    icon: Award,
    value: 15,
    label: "Years Experience",
    suffix: ""
  },
  {
    icon: ThumbsUp,
    value: 98,
    label: "Satisfaction Rate",
    suffix: "%"
  }
];

function Counter({ value, suffix, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const incrementTime = duration / end;
      
      const counter = setInterval(() => {
        start += 1;
        setCount(start);
        
        if (start === end) clearInterval(counter);
      }, incrementTime);

      return () => clearInterval(counter);
    }
  }, [value, duration, isInView]);

  return (
    <span ref={ref} className="text-4xl font-bold text-[#e3b261]">
      {count}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="py-20 bg-[#1a2421] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-repeat" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e3b261' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#e3b261] mb-4">Our Impact in Numbers</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover the scale of our operations and the trust our clients place in us
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-[#2a3431] rounded-lg p-8 text-center relative group hover:bg-[#3a4441] transition-colors duration-300"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#e3b261] to-[#c49a51] rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <stat.icon className="h-12 w-12 text-[#e3b261] mx-auto mb-4" />
              <Counter value={stat.value} suffix={stat.suffix} />
              <p className="text-gray-300 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 