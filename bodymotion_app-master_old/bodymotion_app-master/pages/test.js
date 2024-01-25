import React from 'react'
import { useState, useEffect } from 'react'

const Index = () => {
    const [data, setData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("https://api.publicapis.org/categories");
            if (res.ok) {
                setData(await res.json());
            }
        }

        fetchData().catch(console.error);

    }, [])

    useEffect(() => {
        console.log(data);
    }, [data])

    return (
        <>
            {data != null ?
                <>
                    {data.categories.map((cat, index) => {
                        return <p key={index}>{cat}</p>
                    }
                    )
                    }
                </>
                :
                <div>No data yet</div>
            }
        </>
    )
}

export default Index