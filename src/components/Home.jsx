import { useState, useEffect } from 'react';
import user from '../scripts/user.js';
import { API_URL } from '../constants/api.js';
import { CopyField } from './CopyField.jsx';

function Home() {
    const username = user.getSavedUsername();

    const [streamKey, setStreamKey] = useState('');
    const [locations, setLocations] = useState([]);
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const [servers, key] = await Promise.all([
                    user.getServers(API_URL),
                    user.getStreamKey(API_URL)
                ]);
                setLocations(servers || []);
                setLocation(servers?.[0] || '');
                setStreamKey(key || '');
            } catch (error) {
                console.error('Failed to load stream data:', error);
                alert('Could not load stream information!');
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    function getWebRTCUrl() {
        return `https://${location}/live/${username}`;
    }

    function getStreamURL() {
        return `https://${location}/live/${username}/publish?key=${encodeURIComponent(streamKey)}&video-codec=h264%2F90000&video-bitrate=5000`;
    }

    function getStreamKeyURL() {
        return `${username}?key=${streamKey}`;
    }

    async function logout() {
        try {
            setActionLoading(true);
            const result = await user.logout(API_URL);
            if (!result) {
                alert('Could not log out!');
                return;
            }
            window.location.reload();
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Could not log out!');
        } finally {
            setActionLoading(false);
        }
    }

    async function logoutAll() {
        try {
            setActionLoading(true);
            const result = await user.revokeTokens(API_URL);
            if (!result) {
                alert('Could not log out!');
                return;
            }
            window.location.reload();
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Could not log out!');
        } finally {
            setActionLoading(false);
        }
    }

    async function resetStreamKey() {
        try {
            setActionLoading(true);
            const result = await user.resetStreamKey(API_URL);
            if (result === undefined) {
                alert('Could not reset stream key!');
                return;
            }
            setStreamKey(result);
        } catch (error) {
            console.error('Failed to reset stream key:', error);
            alert('Could not reset stream key!');
        } finally {
            setActionLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div
                    className="spinner-border text-secondary"
                    role="status"
                />
                <p className="mt-3 text-body-secondary">
                    Loading stream information...
                </p>
            </div>
        );
    }

    return (
        <div className="container-fluid px-3 px-md-4 py-4 text-start">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h1 className="home-title mb-1">
                        Welcome, {username}!
                    </h1>
                    <p className="text-body-secondary mb-0">
                        Manage your streaming server and account.
                    </p>
                </div>
                <div style={{ minWidth: '220px' }}>
                    <label
                        htmlFor="location"
                        className="form-label fw-semibold"
                    >
                        Streaming location
                    </label>
                    <select
                        id="location"
                        className="form-select"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        disabled={!locations.length}
                    >
                        {locations.map(server => (
                            <option key={server} value={server}>
                                {server}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="card shadow-sm mb-4">
                <div className="card-body p-4">
                    <div className="mb-4">
                        <h2 className="h4 mb-1">
                            Start your stream
                        </h2>
                        <p className="text-body-secondary mb-0">
                            Configure your streaming software using one
                            of the following protocols.
                        </p>
                    </div>
                    <div className="row g-4">
                        <div className="col-12 col-lg-6">
                            <h3 className="h5">
                                RTMP
                            </h3>
                            <CopyField
                                label="Server URL"
                                value={`rtmp://${location}/live`}
                            />
                            <CopyField
                                label="Stream Key"
                                value={getStreamKeyURL()}
                            />
                        </div>
                        <div className="col-12 col-lg-6">
                            <h3 className="h5">
                                RTSP
                            </h3>
                            <CopyField
                                label="Server URL"
                                value={`rtsp://${location}/live`}
                            />
                            <CopyField
                                label="Stream Key"
                                value={getStreamKeyURL()}
                            />
                        </div>
                        <div className="col-12">
                            <h3 className="h5">
                                SRT
                            </h3>
                            <CopyField
                                label="SRT Publishing URL"
                                value={`srt://${location}:8890?mode=caller&streamid=publish:live/${username}::key=${streamKey}`}
                            />
                        </div>
                    </div>
                    <hr className="my-4" />
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                        <div>
                            <h3 className="h5 mb-1">
                                Stream directly from your browser
                            </h3>
                            <p className="text-body-secondary mb-0">
                                No additional streaming software required.
                            </p>
                        </div>
                        <a
                            href={getStreamURL()}
                            className="btn btn-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Start Browser Stream
                        </a>
                    </div>
                </div>
            </div>
            <div className="card shadow-sm mb-4">
                <div className="card-body p-4">
                    <h2 className="h4 mb-1">
                        Watch your stream
                    </h2>
                    <p className="text-body-secondary mb-4">
                        Use these URLs to watch your live stream
                        in compatible players.
                    </p>
                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <CopyField
                                label="RTMP"
                                value={`rtmp://${location}/live/${username}`}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <CopyField
                                label="RTSP"
                                value={`rtsp://${location}/live/${username}`}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <CopyField
                                label="RTSP (TCP)"
                                value={`rtspt://${location}/live/${username}`}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <CopyField
                                label="HLS"
                                value={`https://${location}/live/${username}/index.m3u8`}
                            />
                        </div>
                    </div>
                    <hr className="my-4" />
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h3 className="h5 mb-1">
                                Watch in your browser
                            </h3>
                            <p className="text-body-secondary mb-0">
                                Open your stream using the WebRTC player.
                            </p>
                        </div>
                        <a
                            href={getWebRTCUrl()}
                            className="btn btn-outline-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Watch Stream
                        </a>
                    </div>
                </div>
            </div>
            <div className="card shadow-sm mb-4">
                <div className="card-body p-4">
                    <h2 className="h4 mb-1">
                        Account management
                    </h2>
                    <p className="text-body-secondary mb-4">
                        Manage your stream key and active sessions.
                    </p>
                    <div className="d-flex flex-column flex-md-row flex-wrap gap-2">
                        <button
                            className="btn btn-outline-warning"
                            onClick={resetStreamKey}
                            disabled={actionLoading}
                        >
                            Reset Stream Key
                        </button>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={logout}
                            disabled={actionLoading}
                        >
                            Logout
                        </button>
                        <button
                            className="btn btn-outline-danger"
                            onClick={logoutAll}
                            disabled={actionLoading}
                        >
                            Logout of All Devices
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
