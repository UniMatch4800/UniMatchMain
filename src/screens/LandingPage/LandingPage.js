import React from 'react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';
import ULyfeLogo from "../../images/ULyfe_final_logo.PNG";
import forumPic from "./Forum.png";
import lynkPic from "./Lynk.png";
import missionPic from "./happygays.jpg";
import eventPic from "./Events.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUsers,
    faComment,
    faCalendarDays,
    faLink,
    faPerson,
    faDiagramProject,
    faPersonCircleQuestion,
    faListCheck,

} from "@fortawesome/free-solid-svg-icons";

const LandingPage = () => {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate("/login");
    }

    const goToSignup = () => {
        navigate("/signup")
    }
    return (
        <div className="landing-page">
            <header className="header">
                <img src={ULyfeLogo} alt="ULyfe Logo" className="logo" />
                <div className="cta-buttons">
                    <button className="login-btn" onClick={goToLogin}>Login</button>
                    <button className="login-btn" onClick={goToSignup}>Sign Up</button>
                </div>
            </header>

            <main>
                <section className='banner'>
                    <div className='banner-content'>
                        <h2>Engage with students on your campus</h2>
                        <p>ULYFE is the top platform for meeting people on campus, sharing opinions, and finding great events to enjoy the college experience</p>
                        <button onClick={goToSignup} className='login-btn'>Sign Up Today</button>
                    </div>
                </section>

                <section className='ulife-offerings'>
                    <h2>ULYFE Offerings</h2>
                    <p>ULYFE is the platform for college students to share opinions, ask questions, meet people, and find events</p>
                    <div className="image-container">
                        <div className="image-item">
                            <h2>Forums</h2>
                            <img src={forumPic} alt="Forum" />
                            <p>Ask questions and get answers from students on your campus. Post anonymously freely share your thoughts about anything campus related or personal</p>
                        </div>
                        <div className="image-item">
                            <h2>Lynks</h2>
                            <img src={lynkPic} alt="Lynks" />
                            <p>Create a profile and starting lynking with people on campus with no expectations. Find friends, study buddies, romantic partners, and more on ULyfe Lynks</p>
                        </div>
                        <div className="image-item">
                            <h2>Events</h2>
                            <img src={eventPic} alt="Events" />
                            <p>The ultimate college experience is just a few clicks away! Find events and get tickets for events hosted by clubs, school admin, frats, and sororities.</p>
                        </div>
                    </div>
                </section>

                <section className='mission-section'>
                    <img src={missionPic} alt="Mission" className="mission-image" />
                    <div className="mission-content">
                        <h2>Our Mission</h2>
                        <p>To bring college students together through the power of technololgy and communication.</p>
                        <p style={{ margin: '25px 0' }}>Whether you're outgoing, introverted, laid-back, or adventurous, there's a place for you in our diverse and inclusive community.</p>
                    </div>
                </section>

                <section className="how-it-works">
                    <div className="how-section-content">
                        <h2>How It Works</h2>
                        <p>Joining ULYFE is quick and easy. Follow these simple steps to get started:</p>
                        <ol>
                            <li><span className="bullet">1</span> <span className='step-title'>Sign Up:</span> Create your account using your student email address.</li>
                            <li><span className="bullet">2</span> <span className='step-title'>Verify Email:</span> Check your inbox and verify your student email address.</li>
                            <li><span className="bullet">3</span> <span className='step-title'>Complete Basic Info:</span> Input some basic information to set up your profile.</li>
                            <li><span className="bullet">4</span> <span className='step-title'>Access Forums and Events:</span> Once verified, you'll gain access to forums and events to connect with your campus community.</li>
                            <li><span className="bullet">5</span> <span className='step-title'>Enhance Your Profile:</span> To access Lynks, our dating page, complete your profile by providing additional information and uploading photos.</li>
                        </ol>
                        <button className="login-btn" onClick={goToSignup}>Get Started</button>
                    </div>
                </section>

                <section className="features-section">
                    <div className="feature">
                        <FontAwesomeIcon icon={faUsers} />
                        <h3>Community</h3>
                        <p>Connect with a vibrant community of students from your campus and beyond.</p>
                    </div>
                    <div className="feature">
                        <FontAwesomeIcon icon={faComment} />
                        <h3>Conversations</h3>
                        <p>Engage in meaningful discussions and exchange ideas on various topics.</p>
                    </div>
                    <div className="feature">
                        <FontAwesomeIcon icon={faCalendarDays} />
                        <h3>Events</h3>
                        <p>Stay updated on upcoming events, parties, and gatherings on and off campus.</p>
                    </div>
                    <div className="feature">
                        <FontAwesomeIcon icon={faLink} />
                        <h3>Connections</h3>
                        <p>Build new friendships, find study buddies, or even discover your soulmate.</p>
                    </div>
                    <div className="feature">
                        <FontAwesomeIcon icon={faPerson} />
                        <h3>Personal</h3>
                        <p>Personalize your profile to showcase your personality and interests</p>
                    </div>
                    <div className="feature">
                        <FontAwesomeIcon icon={faDiagramProject} />
                        <h3>Networking</h3>
                        <p>Discover networking opportunities to improve your present and future experience</p>
                    </div>
                    <div className="feature">
                        <FontAwesomeIcon icon={faListCheck} />
                        <h3>Guest List</h3>
                        <p>RSVP to events and see who else is attending</p>
                    </div>
                    <div className="feature">
                        <FontAwesomeIcon icon={faPersonCircleQuestion} />
                        <h3>Anonymity</h3>
                        <p>Share opinions and thoughts openly without fear of judgment</p>
                    </div>
                </section>
            </main>
            <footer className="footer">
                <p>&copy; 2024 ULyfe</p>
            </footer>
        </div>
    );
}

export default LandingPage;
