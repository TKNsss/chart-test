import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const timeFrames = ["hourly", "daily", "weekly", "monthly"];

const App = () => {
   const [timeFrame, setTimeFrame] = useState("daily");
   const [data, setData] = useState([]);

   // Fetch stock data when timeFrame changes
   useEffect(() => {
     const fetchData = async () => {
       try {
         const url = `${import.meta.env.VITE_API_BASE}/${timeFrame}/NASDAQ`;
         const res = await axios.get(url);
         const candles = res.data.candles || [];

         const formattedData = candles.map((item) => ({
           date: item.date,
           close: item.close,
         }));

         setData(formattedData);
       } catch (err) {
         console.error("Error fetching data:", err);
       }
     };

     fetchData();
   }, [timeFrame]);

   return (
     <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
       <h1 className="text-2xl font-bold mb-6">Tesla Stock Chart (TSLA)</h1>

       {/* Buttons */}
       <div className="flex gap-4 mb-6">
         {timeFrames.map((frame) => (
           <button
             key={frame}
             onClick={() => setTimeFrame(frame)}
             className={`px-4 py-2 rounded-md font-medium ${
               timeFrame === frame
                 ? "bg-blue-600 text-white"
                 : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-200"
             }`}
           >
             {frame}
           </button>
         ))}
       </div>

       {/* Chart */}
       <div className="w-full h-[500px] bg-white rounded-lg shadow p-4">
         <ResponsiveContainer width="100%" height="100%">
           <LineChart data={data}>
             <CartesianGrid strokeDasharray="3 3" />
             <XAxis dataKey="date" hide={false} />
             <YAxis dataKey="close" />
             <Tooltip />
             <Line
               type="monotone"
               dataKey="close"
               stroke="#2563eb"
               strokeWidth={2}
               dot={false}
             />
           </LineChart>
         </ResponsiveContainer>
       </div>
     </div>
   );
};

export default App;
