// /* eslint-disable n/handle-callback-err */
"use client";
import Error from "next/error";
import { useRouter } from "next/navigation";

import React from "react";

const NotFound = ({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  const router = useRouter();

  return (
    <>
      <div className="flex align-middle justify-center md:pt-20 pt-18">
        <div className="flex-container">
          <div className="text-center">
            <h1 className="!pt-[90px] text-center">
              <span className="!text-[5rem] mr-2" id="digit1">
                4
              </span>
              <span className="!text-[5rem] m-2" id="digit2">
                0
              </span>
              <span className="!text-[5rem] ml-2" id="digit3">
                4
              </span>
            </h1>
            <h3 className="text-[3rem] pb-[3rem] text-center ">
              PAGE NOT FOUND
            </h3>
            <div className="md:pb-[4rem] pb-8">
              <div className="max-w-fit inline-flex justify-center align-middle py-3 px-5 rounded bg-black text-white">
                <button
                  className="text-[18px]"
                  onClick={() => router.push("/dashboard")}
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;

// export default function NotFound({
//   error,
//   reset,
// }: {
//   error: Error & { digest?: string };
//   reset: () => void;
// }) {
//   return (
//     <div>
//       <div className="flex align-middle justify-center md:pt-20 pt-18">
//         <div className="flex-container">
//           <div className="text-center">
//             <h1 className="!pt-[90px] text-center">
//               <span className="!text-[5rem] mr-2" id="digit1">
//                 4
//               </span>
//               <span className="!text-[5rem] m-2" id="digit2">
//                 0
//               </span>
//               <span className="!text-[5rem] ml-2" id="digit3">
//                 4
//               </span>
//             </h1>
//             <h3 className="text-[3rem] pb-[3rem] text-center ">
//               PAGE NOT FOUND
//             </h3>
//             <div className="md:pb-[4rem] pb-8">
//               <div className="w-[30%] inline-flex justify-center align-middle p-3 rounded bg-black text-white">
//                 <button className="text-[18px]" onClick={() => reset()}>
//                   Try again
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
