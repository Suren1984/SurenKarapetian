import React, { useEffect, useRef, useState, useMemo, useContext } from "react";
import { JOINTS } from "../../../../constants/Joints";
import Box from "./Box";

function moveJoint(joint, x, y, z) {
    /* let qw = Math.sqrt(1 + m[0] + m[4] + m[8]) / 2
     let qx = (m[5] - m[7]) / (4 * qw)
     let qy = (m[6] - m[2]) / (4 * qw)
     let qz = (m[1] - m[3]) / (4 * qw)*/

    /*   let qw = Math.sqrt(1 + m[0] + m[4] + m[8]) / 2
       let qx = (m[7] - m[5]) / (4 * qw) * -1
       let qy = (m[2] - m[6]) / (4 * qw) * -1
       let qz = (m[3] - m[1]) / (4 * qw) * -1
   
       joint.quaternion.y = qy;
       joint.quaternion.x = qx;
       joint.quaternion.z = qz;
       joint.quaternion.w = qw;*/

    joint.position.x = x * -1;
    joint.position.y = y;
    //joint.position.z = z;

}

export default function Character2({ position, scale, handleData }) {
    const [joints, setJoints] = useState([])
    const [neck, setNeck] = useState(0, 0, 0);
    const [waist, setWaist] = useState(undefined);
    const [data, setData] = useState([{ jointDatas: [] }])
    const [refresh, setRefresh] = useState(false)
    const [load, setLoad] = useState(true)
    const [spinePosition, setSpinePosition] = useState([0, 0, 0])
    const [leftLegPosition, setleftLegPosition] = useState([-20, -50, 0])
    const [rightLegPosition, setrightLegPosition] = useState([20, -50, 0])


    useEffect(() => {
        if (handleData() != null) {
            setData(handleData());
            setLoad(true);
        }
    }, [handleData])


    const MINUTE_MS = 50;

    useEffect(() => {
        const interval = setInterval(() => {
            setRefresh(true);
        }, MINUTE_MS);

        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])

    useEffect(() => {
        if (load && refresh) {
            try {
                data[0].jointDatas.forEach((joint, i) => {
                   // Object.keys(joints).forEach((joint_key) => {
                        if (i == 0) {
                            setSpinePosition([joint.real.X, joint.real.Y - 300, 0]);
                        }
                        if (i == 2) {

                            setleftLegPosition([joint.real.X, joint.real.Y - 300, 0]);
                        }
                        if (i == 3) {
                            setrightLegPosition([joint.real.X, joint.real.Y - 300, 0]);
                        }
                    });
                    //console.log(joint);
              //  });
            } catch {

            }
            setRefresh(false)
        }

    }, [data])

    return (
        <div>
            <div
                style={{
                    position: "absolute",
                    left: `${spinePosition[1]}px`,
                    top: `${spinePosition[0]}px`,
                }}
            >
                Neck
            </div>
            <div
                style={{
                    position: "absolute",
                    left: `${leftLegPosition[1]}px`,
                    top: `${leftLegPosition[0]}px`,
                }}
            >
                Left Leg
            </div>
            <div
                style={{
                    position: "absolute",
                    left: `${rightLegPosition[1]}px`,
                    top: `${rightLegPosition[0]}px`,
                }}
            >
                Right Leg
            </div>
        </div>
    );
}
