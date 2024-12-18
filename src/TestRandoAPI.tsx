import { useState } from "react";
import $ from "jquery";

function TestRandoAPI() {
    const [words, setWords] = useState<string[]>([]);
    const [numWords, setNumWords] = useState(10);

    function handleSubmit(){
        console.log("clicked. num:"+numWords);
        $.ajax({
            url: "https://random-word-api.vercel.app/api?words=" + numWords,
            method: "GET",
            dataType: "json",
            success: function(res){
                console.log("success")
                console.log(res)
                setWords(res);
            },
            error: function(res){
                console.log("error")
                console.log(res)
            }
        });
    }

    return (
        <>
            <h1>Rando API Test</h1>
            <input type="number" value={numWords} onChange={(e)=>setNumWords(e.target.value)}/>
            <input type="submit" value="Fetch" onClick={handleSubmit}/>
            {
                words.map((v,i)=>{
                    return <p key={i}>{v}</p>
                })
            }
        </>
    );
}

export default TestRandoAPI;