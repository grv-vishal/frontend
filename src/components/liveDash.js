import React,{useState,useEffect,useRef} from 'react'
import {LoadGraph} from './graph'
import img from '../assets/chargingEV.png'
import VehicleBatteryIndicator from './temp'



const Station = () => {
    
    const [soc1,setSoc1] = useState(20);
    const [soc2,setSoc2] = useState(40);
    const [soc3,setSoc3] = useState(85);
    const [load,setLoad] = useState(0);
    const [loadHistory,setLoadHistory] = useState([]);
    const [loadState,setLoadState] = useState('Low');

    //Charging States
    const [state1,setState1] = useState("Charging");
    const [state2,setState2] = useState("Charging");
    const [state3,setState3] = useState("Charging");

    const countRef = useRef(0);


    useEffect(() =>{

        const fetchData = async () => {
            try {
              const response = await fetch("http://192.168.137.180/data", {
                  method:'GET',
                  credentials:'omit',
                  
              });
              
              const data = await response.json();

              console.log(data);

              //console.log(typeof(data));
               

            setSoc1(data["SOC[1]"]);
            setSoc2(data["SOC[2]"]);
            setSoc3(data["SOC[3]"]);
            setLoad(data.load);

            if(data.load < 1400){
                setLoadState("Low");
            }
            else if(data.load >= 1400 && data.load <= 2800){
                setLoadState("Medium");
            }
            else{
                setLoadState("High");
            }

            setLoadHistory(prev => [
                ...prev,
                {
                  timestamp: countRef.current++,
                  values: data.load.toString()
                }
            ]);

            //console.log("Load Data");
            //console.log(load);


            } catch (error) {
              console.error("Error fetching data:", error);
            }
          };
      
          fetchData();
          const interval = setInterval(fetchData, 2000); // Fetch new data every 5 seconds
      
          return () => clearInterval(interval);

    },[]);




    //Forced Charging 
    const [ev,setEv]=useState({"ev1":false,"ev2":false,"ev3":false});

    const handleQuickCharge = async (evKey) => {
        const updatedEv = { ...ev, [evKey]: !ev[evKey] };
        setEv(updatedEv);

        try{
            const response = await fetch("http://192.168.137.180/updateEV", {
                method:'POST',
                credentials:'omit',
                body: JSON.stringify(updatedEv),    
            });

            const data = await response.json();
            //console.log("EV States",updatedEv);

            //console.log(data);
            

        }
        catch(error){
            console.error("Error fetching data:", error);
        }
        
    }








    //Changing states of the vehicles
    useEffect(() => {

        //Charging State of Vehicle 1
        if((load < 1400 && soc1 < 80) || (load >= 1400 && load <= 2800 && soc1 < 50) || ev.ev1){
            setState1("Charging");
        }
        else if(load >= 2800 && soc1 > 50){
            setState1("Discharging");
        }
        else{
            setState1("Idle");
        }

        //Charging State of Vehicle 2
        if((load < 1400 && soc2 < 80) || (load >= 1400 && load <= 2800 && soc2 < 50) || ev.ev2){
            setState2("Charging");
        }
        else if(load > 2800 && soc2 > 50){
            setState2("Discharging");
        }
        else{
            setState2("Idle");
        }

        //Charging State of Vehicle 3
        if((load < 1400 && soc3 < 80) || (load >= 1400 && load <= 2800 && soc3 < 50) || ev.ev3 ){
            setState3("Charging");
        }
        else if(load >= 2800 && soc3 > 50){
            setState3("Discharging");
        }
        else{
            setState3("Idle");
        }

        console.log("State 1: ",state1);
        console.log("State 2: ",state2);
        console.log("State 3: ",state3);

    },[load,soc1,soc2,soc3]);




  return (
    <div className='relative'>

      <div className='absolute left-10 top-4 shadow-md bg-white rounded-md px-4 py-2 flex flex-col justify-center items-center'>
        <div className='font-bold text-3xl'>Grid Load</div>
        <div className='font-semibold text-2xl'>{loadState}</div>
      </div>  
      <div>
        <h1 className="text-center text-3xl font-bold pt-4"> Electric Vehicle Charging Management System</h1>
        <p className='text-center text-2xl font-semibold pb-8 text-gray-800'> (A Smart Grid Project)</p>
      </div>
      

      <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10 p-6 w-full'>

         {/* Charging Vehicles */}
        <div className='relative flex flex-col justify-center items-center shadow-lg border border-gray-300 rounded-lg p-2 w-full h-full min-h-[450px]'>

          <h1 className='absolute top-4 text-center text-4xl font-semibold pb-4'>Charging Station</h1>

          <div className='flex flex-row justify-evenly items-center gap-[100px]'>

            {/* Charging Vehicle 1 */}
            <div className='flex flex-row justify-center items-center gap-2 relative'>   

               <img src={img} alt="Charging Vehicle1" className='w-[120px] h-[100px] shadow-lg' />
               <div className='absolute -top-16 left-12 bg-white shadow-lg rounded-md px-2 py-2 w-[100px] '>

                <div className='text-md font-semibold '>{state1}</div>
                <div className='text-md font-semibold'> SOC : {soc1}%</div>
               </div>

               <div className='h-20 w-8'>
                <VehicleBatteryIndicator state={state1} soc={soc1} />
               </div>
               
               <button onClick={()=> {
                    handleQuickCharge('ev1');
                }} 
                className={`p-2 shadow-md rounded-md transition-colors duration-300 -bottom-14 mt-2 absolute ${
                    ev.ev1 ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
                  }`}
               >
               {ev.ev1 ? 'Quick Charge' : 'Quick Charge'}
               </button>
              
            </div>

            {/* Charging Vehicle 2 */}
            <div className='flex flex-row justify-center items-center gap-2 relative'>   

               <img src={img} alt="Charging Vehicle1" className='w-[120px] h-[100px] shadow-lg' />
               <div className='absolute -top-16 left-12 bg-white shadow-lg rounded-md px-2 py-2 w-[100px] '>

                <div className='text-md font-semibold '>{state2}</div>
                <div className='text-md font-semibold'> SOC : {soc2}%</div>

               </div>

               <div className='h-20 w-8'>
                <VehicleBatteryIndicator state={state2} soc={soc2} />
               </div>

               <button onClick={()=> {
                    handleQuickCharge('ev2');
                }} 
                className={`p-2 shadow-md rounded-md transition-colors duration-300 -bottom-14 mt-2 absolute ${
                    ev.ev2 ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
                  }`}
               >
               {ev.ev2 ? 'Quick Charge' : 'Quick Charge'}
               </button>
              
            </div>

            {/* Charging Vehicle 3 */}
            <div className='flex flex-row justify-center items-center gap-2 relative '>   

               <img src={img} alt="Charging Vehicle1" className='w-[120px] h-[100px] shadow-lg' />
               <div className='absolute -top-16 left-12 bg-white shadow-lg rounded-md px-2 py-2 w-[100px] '>

                <div className='text-md font-semibold '>{state3}</div>
                <div className='text-md font-semibold'> SOC : {soc3}%</div>

               </div>

               <div className='h-20 w-8'>
                <VehicleBatteryIndicator state={state3} soc={soc3} />
               </div>

               <button onClick={()=> {
                    handleQuickCharge('ev3');
                }} 
                className={`p-2 shadow-md rounded-md transition-colors duration-300 -bottom-14 mt-2 absolute ${
                    ev.ev3 ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
                  }`}
               >
               {ev.ev3 ? 'Quick Charge' : 'Quick Charge'}
               </button>
              
            </div>
          </div>

        </div>

        
        {/*Load Consumption Graph */}
        <div className="border border-gray-300 rounded-lg shadow-lg p-2 w-full h-full min-h-[450px]">
         <LoadGraph load={loadHistory} />
        </div>
      </div>
      
    </div>
  )
}

export default Station
