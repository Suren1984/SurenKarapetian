import ButterflyImage from "../src/assets/images/butterfly.jpg";
import CityRacerImage from "../src/assets/images/cityracer.jpg";
import KayakImage from "../src/assets/images/kayak.jpg";
import KungFuImage from "../src/assets/images/kungfu.jpg";
import PilotAcademyImage from "../src/assets/images/pilotacademy.jpg";
import PirateIslandImage from "../src/assets/images/pirateinsland.jpg";
import BirdGameWinter from "../src/assets/images/BirdGameWinter.jpg";
import RaftingImage from "../src/assets/images/rafting.jpg";

export const getGames = (data) => {
    const games = [
        {
            name: "Pilot Academy",
            image: PilotAcademyImage,
            descr: 'This is description of the game. This is description of the game.',
            params: [
                {
                    mode: 'leftright',
                    data: [
                        {
                            type: 'main',
                            name: 'Spine Rotation',
                            value1: data.posture.vals.data.single[0].Max,
                            value2: data.posture.vals.data.single[0].Min
                        },
                        {
                            name: 'Spine Lateroflexion',
                            value1: data.posture.vals.data.single[1].Max,
                            value2: data.posture.vals.data.single[1].Min
                        }
                    ]
                },
                {
                    mode: 'anteroretro',
                    data: [
                        {
                            name: 'Thoracic Flexion',
                            mode: 'anteroretro',
                            value1: data.posture.vals.data.single[2].Max,
                            value2: data.posture.vals.data.single[2].Min
                        }
                    ]
                }
            ]
        },
        {
            name: "City Racer",
            image: CityRacerImage,
            descr: 'This is description of the game. This is description of the game.',
            params: [
                {
                    mode: 'leftright',
                    data: [
                        {
                            type: 'main',
                            name: 'Spine Lateroflexion',
                            value1: data.posture.vals.data.single[1].Max,
                            value2: data.posture.vals.data.single[1].Min
                        },
                        {
                            name: 'Spine Rotation',
                            value1: data.posture.vals.data.single[0].Max,
                            value2: data.posture.vals.data.single[0].Min
                        },
                    ]
                },
                {
                    mode: 'anteroretro',
                    data: [
                        {
                            name: 'Thoracic Flexion',
                            mode: 'anteroretro',
                            value1: data.posture.vals.data.single[2].Max,
                            value2: data.posture.vals.data.single[2].Min
                        }
                    ]
                }
            ]
        },
        {
            name: "Kayak",
            image: KayakImage,
            descr: 'This is description of the game. This is description of the game.',
            params: [
                {
                    mode: 'anteroretro',
                    data: [
                        {
                            type: 'main',
                            name: 'Thoracic Flexion',
                            mode: 'anteroretro',
                            value1: data.posture.vals.data.single[2].Max,
                            value2: data.posture.vals.data.single[2].Min
                        }
                    ]
                },
                {
                    mode: 'leftright',
                    data: [
                        {
                            name: 'Spine Rotation',
                            value1: data.posture.vals.data.single[0].Max,
                            value2: data.posture.vals.data.single[0].Min
                        },
                        {
                            name: 'Spine Lateroflexion',
                            value1: data.posture.vals.data.single[1].Max,
                            value2: data.posture.vals.data.single[1].Min
                        }
                    ]
                },
            ]
        },
        {
            name: "Pirate Island",
            image: PirateIslandImage,
            descr: 'This is description of the game. This is description of the game.',
            params: [
                {
                    mode: 'leftright',
                    data: [
                        {
                            name: 'Spine Rotation',
                            value1: data.posture.vals.data.single[0].Max,
                            value2: data.posture.vals.data.single[0].Min
                        },
                        {
                            name: 'Spine Lateroflexion',
                            value1: data.posture.vals.data.single[1].Max,
                            value2: data.posture.vals.data.single[1].Min
                        },
                        {
                            name: 'Hip Flexion / Extension',
                            value1: data.gait.vals.data.leftSide[0].Max,
                            value2: data.gait.vals.data.rightSide[0].Max
                        },
                        {
                            name: 'Knee Flexion / Extension',
                            value1: data.gait.vals.data.leftSide[1].Max,
                            value2: data.gait.vals.data.rightSide[1].Max
                        },
                        {
                            name: 'Hip Abduction / Adduction',
                            value1: data.gait.vals.data.leftSide[3].Max,
                            value2: data.gait.vals.data.rightSide[3].Max
                        },
                        {
                            name: 'Knee Abduction / Adduction',
                            value1: data.gait.vals.data.leftSide[4].Max,
                            value2: data.gait.vals.data.rightSide[4].Max
                        }
                    ]
                },
                {
                    mode: 'anteroretro',
                    data: [
                        {
                            name: 'Thoracic Flexion',
                            mode: 'anteroretro',
                            value1: data.posture.vals.data.single[2].Max,
                            value2: data.posture.vals.data.single[2].Min
                        }
                    ]
                }
            ]
        },
        {
            name: "Rafting",
            image: RaftingImage,
            descr: 'This is description of the game. This is description of the game.',
            params: [
                {
                    mode: 'leftright',
                    data: [
                        {
                            name: 'Spine Rotation',
                            value1: data.posture.vals.data.single[0].Max,
                            value2: data.posture.vals.data.single[0].Min
                        },
                        {
                            name: 'Spine Lateroflexion',
                            value1: data.posture.vals.data.single[1].Max,
                            value2: data.posture.vals.data.single[1].Min
                        },
                        {
                            name: 'Hip Flexion / Extension',
                            value1: data.gait.vals.data.leftSide[0].Max,
                            value2: data.gait.vals.data.rightSide[0].Max
                        },
                        {
                            name: 'Knee Flexion / Extension',
                            value1: data.gait.vals.data.leftSide[1].Max,
                            value2: data.gait.vals.data.rightSide[1].Max
                        },
                        {
                            name: 'Hip Abduction / Adduction',
                            value1: data.gait.vals.data.leftSide[3].Max,
                            value2: data.gait.vals.data.rightSide[3].Max
                        },
                        {
                            name: 'Knee Abduction / Adduction',
                            value1: data.gait.vals.data.leftSide[4].Max,
                            value2: data.gait.vals.data.rightSide[4].Max
                        }
                    ]
                },
                {
                    mode: 'anteroretro',
                    data: [
                        {
                            name: 'Thoracic Flexion',
                            mode: 'anteroretro',
                            value1: data.posture.vals.data.single[2].Max,
                            value2: data.posture.vals.data.single[2].Min
                        }
                    ]
                }
            ]
        },
        {
            name: "Butterfly Catcher",
            image: ButterflyImage,
            descr: 'This is description of the game. This is description of the game.',
            params: [
                {
                    mode: 'leftright',
                    data: [
                        {
                            name: 'Spine Rotation',
                            value1: data.posture.vals.data.single[0].Max,
                            value2: data.posture.vals.data.single[0].Min
                        },
                        {
                            name: 'Spine Lateroflexion',
                            value1: data.posture.vals.data.single[1].Max,
                            value2: data.posture.vals.data.single[1].Min
                        },
                        {
                            name: 'Shoulder Abdution / Adduction',
                            value1: data.posture.vals.data.leftSide[0].Max,
                            value2: data.posture.vals.data.rightSide[0].Max
                        },
                        {
                            name: 'Shoulder Flexion / Extension',
                            value1: data.posture.vals.data.leftSide[1].Max,
                            value2: data.posture.vals.data.rightSide[1].Max
                        },
                        {
                            name: 'Elbow Flexion / Extension',
                            value1: data.posture.vals.data.leftSide[2].Max,
                            value2: data.posture.vals.data.rightSide[2].Max
                        },

                    ]
                },
                {
                    mode: 'anteroretro',
                    data: [
                        {
                            name: 'Thoracic Flexion',
                            mode: 'anteroretro',
                            value1: data.posture.vals.data.single[2].Max,
                            value2: data.posture.vals.data.single[2].Min
                        }
                    ]
                }
            ]
        },
        {
            name: "Bird Game",
            image: BirdGameWinter,
            descr: 'This is description of the game. This is description of the game.',
            params: [
                {
                    mode: 'leftright',
                    data: [
                        {
                            name: 'Spine Rotation',
                            value1: data.posture.vals.data.single[0].Max,
                            value2: data.posture.vals.data.single[0].Min
                        },
                        {
                            name: 'Spine Lateroflexion',
                            value1: data.posture.vals.data.single[1].Max,
                            value2: data.posture.vals.data.single[1].Min
                        },
                        {
                            name: 'Shoulder Abdution / Adduction',
                            value1: data.posture.vals.data.leftSide[0].Max,
                            value2: data.posture.vals.data.rightSide[0].Max
                        },
                        {
                            name: 'Shoulder Flexion / Extension',
                            value1: data.posture.vals.data.leftSide[1].Max,
                            value2: data.posture.vals.data.rightSide[1].Max
                        },
                        {
                            name: 'Elbow Flexion / Extension',
                            value1: data.posture.vals.data.leftSide[2].Max,
                            value2: data.posture.vals.data.rightSide[2].Max
                        },

                    ]
                },
                {
                    mode: 'anteroretro',
                    data: [
                        {
                            name: 'Thoracic Flexion',
                            mode: 'anteroretro',
                            value1: data.posture.vals.data.single[2].Max,
                            value2: data.posture.vals.data.single[2].Min
                        }
                    ]
                }
            ]
        },
        {
            name: "Kung Fu",
            image: KungFuImage,
            descr: 'This is description of the game. This is description of the game.',
            params: [
                {
                    mode: 'leftright',
                    data: [
                        {
                            name: 'Spine Rotation',
                            value1: data.posture.vals.data.single[0].Max,
                            value2: data.posture.vals.data.single[0].Min
                        },
                        {
                            name: 'Spine Lateroflexion',
                            value1: data.posture.vals.data.single[1].Max,
                            value2: data.posture.vals.data.single[1].Min
                        },
                        {
                            name: 'Shoulder Abdution / Adduction',
                            value1: data.posture.vals.data.leftSide[0].Max,
                            value2: data.posture.vals.data.rightSide[0].Max
                        },
                        {
                            name: 'Shoulder Flexion / Extension',
                            value1: data.posture.vals.data.leftSide[1].Max,
                            value2: data.posture.vals.data.rightSide[1].Max
                        },
                        {
                            name: 'Elbow Flexion / Extension',
                            value1: data.posture.vals.data.leftSide[2].Max,
                            value2: data.posture.vals.data.rightSide[2].Max
                        },
                        {
                            name: 'Hip Flexion / Extension',
                            value1: data.gait.vals.data.leftSide[0].Max,
                            value2: data.gait.vals.data.rightSide[0].Max
                        },
                        {
                            name: 'Knee Flexion / Extension',
                            value1: data.gait.vals.data.leftSide[1].Max,
                            value2: data.gait.vals.data.rightSide[1].Max
                        },
                        {
                            name: 'Hip Abduction / Adduction',
                            value1: data.gait.vals.data.leftSide[3].Max,
                            value2: data.gait.vals.data.rightSide[3].Max
                        },
                        {
                            name: 'Knee Abduction / Adduction',
                            value1: data.gait.vals.data.leftSide[4].Max,
                            value2: data.gait.vals.data.rightSide[4].Max
                        }
                    ]
                },
                {
                    mode: 'anteroretro',
                    data: [
                        {
                            name: 'Thoracic Flexion',
                            mode: 'anteroretro',
                            value1: data.posture.vals.data.single[2].Max,
                            value2: data.posture.vals.data.single[2].Min
                        }
                    ]
                }
            ]
        }
    ]
    return games;
}