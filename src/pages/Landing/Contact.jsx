import React from "react";
import Navbar from "../components/Navbar";
import "./contact.css";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ChevronDown,
  Briefcase,
  Building2,
  Users,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function Contact() {
  return (
    <>
      <Navbar />

      <main className="contact-page">
        <section className="contact-hero">
          <div className="contact-left">
            <h1>Contact Us</h1>

            <p>
              Have a question about jobs, companies, applications, or your
              SkillHive account? Our team is here to help you.
            </p>

            <div className="contact-info">
              <a href="mailto:support@skillhive.com">support@skillhive.com</a>
              <a href="tel:1234567890">123 456 7890</a>
              <span>Customer Support</span>
            </div>

            <div className="contact-support-grid">
              <div>
                <h4>For Job Seekers</h4>
                <p>
                  Get help with applications, resumes, saved jobs, and account
                  issues.
                </p>
              </div>

              <div>
                <h4>For Employers</h4>
                <p>
                  Need help posting jobs, managing applicants, or updating your
                  company profile?
                </p>
              </div>

              <div>
                <h4>Platform Support</h4>
                <p>
                  Report technical issues, login problems, or feedback about
                  SkillHive.
                </p>
              </div>
            </div>
          </div>

          <div className="contact-form-card">
            <h2>Get in Touch</h2>
            <p>You can reach us anytime</p>

            <form>
              <div className="form-row">
                <input type="text" placeholder="First name" />
                <input type="text" placeholder="Last name" />
              </div>

              <div className="input-icon">
                <Mail size={17} />
                <input type="email" placeholder="Your email" />
              </div>

              <div className="phone-row">
                <button type="button">
                  +92 <ChevronDown size={14} />
                </button>
                <input type="text" placeholder="Phone number" />
              </div>

              <textarea placeholder="How can we help?" maxLength="200"></textarea>

              <button className="submit-btn" type="button">
                Submit
              </button>

              <small>
                By contacting us, you agree to our Terms of Service and Privacy
                Policy.
              </small>
            </form>
          </div>
        </section>

        <section className="location-section">
          <div className="map-box">
            <div className="map-card">
              <div className="map-logo">S</div>
              <div>
                <h4>SkillHive HQ</h4>
                <p>Connecting talent with opportunity</p>
                <strong>Lahore, Pakistan</strong>
                <span>Open Google Maps →</span>
              </div>
            </div>

            <div className="map-pin"></div>
          </div>

          <div className="location-content">
            <span>Our Location</span>
            <h2>Connecting Students and Employers</h2>

            <h4>Headquarters</h4>
            <p>
              SkillHive
              <br />
              Lahore, Pakistan
              <br />
              support@skillhive.com
              <br />
              123 456 7890
            </p>
          </div>
        </section>

        <section className="faq-section">
          <div className="faq-left">
            <span>FAQ</span>
            <h2>Do you have any questions for us?</h2>
            <p>
              If there is anything you want to ask, send us your email and our
              team will respond as soon as possible.
            </p>

            <div className="faq-email">
              <Mail size={16} />
              <input type="email" placeholder="Enter your email" />
              <button>Submit</button>
            </div>
          </div>

          <div className="faq-list">
            <div className="faq-item">
              <p>How can I apply for jobs on SkillHive?</p>
              <ChevronDown size={18} />
            </div>

            <div className="faq-item">
              <p>How can a company post a job?</p>
              <ChevronDown size={18} />
            </div>

            <div className="faq-item">
              <p>Can I save jobs and apply later?</p>
              <ChevronDown size={18} />
            </div>

            <div className="faq-item">
              <p>Is SkillHive free for students?</p>
              <ChevronDown size={18} />
            </div>
          </div>
        </section>

        <section className="contact-cta">
          <div className="cta-overlay">
            <h2>Ready to find the right opportunity with SkillHive?</h2>

            <div className="cta-buttons">
              <button>
                <Briefcase size={16} /> Find Jobs
              </button>
              <button className="outline-btn">
                <Building2 size={16} /> Post a Job
              </button>
            </div>
          </div>
        </section>

        <footer className="contact-footer">
          <div className="footer-brand">
            <div className="footer-logo">S</div>
            <h3>SkillHive</h3>
            <p>Where talent meets opportunity.</p>
          </div>

          <div className="footer-col">
            <h4>For Candidates</h4>
            <a>Browse Jobs</a>
            <a>Saved Jobs</a>
            <a>Applications</a>
          </div>

          <div className="footer-col">
            <h4>For Employers</h4>
            <a>Post Job</a>
            <a>Company Dashboard</a>
            <a>Manage Applicants</a>
          </div>

          <div className="footer-col">
            <h4>Social Media</h4>
            <a><FaFacebookF /> Facebook</a>
            <a><FaInstagram /> Instagram</a>
            <a><FaLinkedinIn /> LinkedIn</a>
            <a><FaTwitter /> Twitter</a>
          </div>
        </footer>
      </main>
    </>
  );
}