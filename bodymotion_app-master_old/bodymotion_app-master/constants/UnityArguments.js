export const PilotAcademyArgument = (data) => {
    const argument = {
        "Torso": {
            "Rotation": {
                "Left": {
                    "Type": "Limit",
                    "Value": {
                        "Limit": 0,
                        "Max": Math.abs(data.posture.vals.data.single[0].Max)
                    }
                },
                "Right": {
                    "Type": "Limit",
                    "Value": {
                        "Limit": 0,
                        "Max": Math.abs(data.posture.vals.data.single[0].Min)
                    }
                }
            },
            "Lateroflexion": {
                "Left": {
                    "Type": "Tip",
                    "Value": Math.abs(data.posture.vals.data.single[1].Max)
                },
                "Right": {
                    "Type": "Tip",
                    "Value": Math.abs(data.posture.vals.data.single[1].Min)
                }
            },
            "Flexion": {
                "Antero": {
                    "Type": "Tip",
                    "Value": Math.abs(data.posture.vals.data.single[2].Max)
                },
                "Retro": {
                    "Type": "Tip",
                    "Value": Math.abs(data.posture.vals.data.single[2].Min)
                }
            }
        }
    }
    return argument;
}