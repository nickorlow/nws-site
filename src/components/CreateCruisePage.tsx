import {useState} from "react";
import URI from "urijs";
import {Namespace} from "../nws-api/types";
import {useNWSAccount, useNWSAuthKey} from "../nws-api/hooks";

export default function CreateCruisePage() {
    const [page, setPage] = useState('info');
    const [strat, setStrat] = useState<'raw-html' | 'react-js'>('raw-html');
    const [owner, setOwner] = useState('');
    const [repo, setRepo] = useState('');
    const [name, setName] = useState('');

    const [gitUriInput, setGUI] = useState('');
    const [hostUriInput, setHUI] = useState('');

    const authKey = useNWSAuthKey();
    const acct = useNWSAccount();


    function deploy() {
        fetch("https://api-nws.nickorlow.com/Services/" + acct!.id + "/service",
            {
                method: 'POST',
                headers: {
                    "Authorization": authKey
                },
                body: JSON.stringify({
                    "serviceName": name,
                    "containerUrl": `ghcr.io/${owner}/${repo}`,
                    "namespaceId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    "serviceUrl": hostUriInput,
                })
            }).then((response)=> {
                if(response.status === 200) {

                }
            }).catch((ex) =>{
                alert(ex)
            });
    }

    return (
        <div className={"App"}>
            <h1>Create Container Deployment</h1>
            <div style={{width: "75vw"}}>
                {
                    page === 'info' &&
                    <div>
                        <h3>Some information before we get started:</h3>
                        <ul>
                            <li>NWS is free to use</li>
                            <li>Currently, your DNS provider must support DNS flattening if you intend to point your root domain (e.g. nickorlow.com) to NWS. Subdomains should work fine though. (Cloudflare, Route 53, and Pagely). (Moving to Cloudflare is pretty easy)</li>
                            <li>Through the Web UI, you may only add one domain name. If you need to add more, <a href={"mailto:nws-support@nickorlow.com"}>contact me</a></li>
                            <li>NWS does not guarantee any uptime</li>
                            <li>NWS is run by a college student with little free time, support may reflect this</li>
                            <li>This platform is very early in development. It may require you to have some technical
                                knowledge.
                            </li>
                            <li>NWS may cease operations in the event of a widespread viral infection transmitted via
                                bites or contact with bodily fluids that causes human corpses to reanimate and seek to
                                consume living human flesh, blood, brain or nerve tissue and is likely to result in the
                                fall of organized civilization.
                            </li>
                        </ul>
                        <button onClick={()=>setPage('framework-hostname')}>I understand, continue</button>
                    </div>
                }
                {
                    page === 'framework-hostname' &&
                    <div>
                        <h5>What is this deployment's name?</h5>
                        <i>May only be lowercase letters and dashes, max 20 chars</i>
                        <br/>
                        <input value={name} onChange={(e)=>{setName(e.currentTarget.value)}}/>
                        <br/>
                        <h5>How did you create your website?</h5>
                        <p>Don't see your technology/framework? Email me: <a href={"mailto:nws-support@nickorlow.com"}>nws-support@nickorlow.com</a></p>
                        <select value={strat}>
                            <option id={"raw-html"} onClick={()=>setStrat('raw-html')}>Raw HTML</option>
                            <option id={"react-js"} onClick={()=>setStrat('react-js')}>React JS</option>
                        </select>
                        <br/>
                        <h5>What is the url of the github repo where your code is hosted? (e.g. https://github.com/nickorlow/personal-site)</h5>
                        <p>Other git hosting providers are not currently supported through the Web UI</p>
                        <p>The repo must be public to create it through the Web UI</p>
                        <input value={gitUriInput} onInput={(e)=>{setGUI(e.currentTarget.value)}}/>
                        <br/>
                        <h5>What domain name will you use with your website? (e.g. nickorlow.com)</h5>
                        <input value={hostUriInput} onChange={(e)=>{setHUI(e.currentTarget.value)}}/>
                        <br/>
                        <button onClick={()=>{
                            try {
                                let git_url = new URL(gitUriInput);

                                if (git_url.host !== 'github.com') {
                                    alert('Only github is supported!')
                                    return;
                                } else {
                                    console.log(git_url.pathname.split('/'))
                                    setOwner(git_url.pathname.split('/')[1])
                                    setRepo(git_url.pathname.split('/')[2])
                                }
                            } catch (e) {
                                alert('invalid github url')
                                return;
                            }


                            try {
                                let url = new URL("https://"+hostUriInput);
                            } catch (e) {
                                alert('invalid host url')
                                return;
                            }

                            if(!/^[a-z-]+$/.test(name) || name.length > 20 || name.length == 0) {
                                alert('may only be lowercase and dashes and under 20 chars')
                                return;
                            }
                            setHUI("https://"+hostUriInput);
                            setPage('scriptgen')
                        }}>Continue</button>
                        <button onClick={()=>{setPage('info')}}>Back</button>
                    </div>
                }
                {
                    page === 'scriptgen' &&
                    <div>
                        <h4>Copy & Paste the below into your terminal to add NWS deployment scripts to your webapp</h4>
                        <code style={{backgroundColor: "black", padding: 5, borderRadius: 10}}> curl -s https://raw.githubusercontent.com/nickorlow/nws-ghactions-templates/main/add-nws.sh | bash -s  {strat} {owner} {repo}</code>
                        <br/><span>Ensure the script finishes running before continuing</span>
                        <br/>
                        <button onClick={()=>{
                            deploy();
                            setPage('dns');
                        }}>Continue</button>
                        <button onClick={()=>setPage('framework-hostname')}>Back</button>
                    </div>
                }
                {
                    page === 'dns' &&
                    <div>
                        <h4>Add the following DNS entry to {new URI(hostUriInput).hostname()}</h4>
                        {
                            new URI(hostUriInput).subdomain().length == 0 &&
                            <div>
                                <p>If your DNS provider is:</p>
                                <ul>
                                    <li>Cloudflare</li>
                                    <li>Route 53</li>
                                    <li>Pagely</li>
                                </ul>
                                <p>Type: CNAME</p>
                                <p>Name: @ ({hostUriInput})</p>
                                <p>Value: entry.nws.nickorlow.com</p>
                            </div>
                        }
                        {
                            new URI(hostUriInput).subdomain().length > 0 &&
                            <div>
                                <p>Type: CNAME</p>
                                <p>Name: {new URI(hostUriInput).subdomain()} ({new URI(hostUriInput).hostname()})</p>
                                <p>Value: entry.nws.nickorlow.com</p>
                            </div>
                        }
                        <br/>
                        <button onClick={()=>setPage('done')}>Finish Setup</button>
                    </div>
                }
                {
                    page === 'done' &&
                    <div>
                        <h3>Welcome to NWS</h3> <br/>
                        <button onClick={()=>{window.location.href="/dashboard"}}>Go to Dashboard</button> <br/>
                        <button onClick={()=>{window.location.href=hostUriInput}}>See my Site</button>
                    </div>
                }
            </div>
        </div>
    );
}
