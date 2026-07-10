"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';

export default function PhysicianRegistration() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    hospital: '',
    specialty: '',
    remark: ''
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validPhone = (v: string) => {
    const digits = v.replace(/[^0-9]/g, '');
    return digits.length >= 7;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }

    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let ok = true;
    const newErrors: Record<string, boolean> = {};

    if (formData.firstName.trim().length === 0) { newErrors.firstName = true; ok = false; }
    if (formData.lastName.trim().length === 0) { newErrors.lastName = true; ok = false; }
    if (!validEmail(formData.email.trim())) { newErrors.email = true; ok = false; }
    if (!validPhone(formData.phone.trim())) { newErrors.phone = true; ok = false; }
    if (formData.hospital.trim().length === 0) { newErrors.hospital = true; ok = false; }

    setErrors(newErrors);

    if (!ok) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/physicians', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Submission failed.');
      }

      setIsSuccess(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Injecting the exact CSS provided. 
        In Next.js, font links are usually handled in layout.tsx via next/font, 
        but they are kept here to ensure 100% fidelity with your original code.
      */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
          
          :root {
            --ink: #161A1F;
            --ink-soft: #5B6472;
            --line: #E4E8EC;
            --paper: #F6F8F9;
            --card: #FFFFFF;
            --teal: #2FBF9F;
            --blue: #2E4FA3;
            --blue-light: #4FA9E8;
            --teal-tint: #EAF9F5;
            --blue-tint: #EEF1FA;
            --danger: #D8483C;
            --radius: 14px;
          }
          * { box-sizing: border-box; }
          html, body { margin: 0; padding: 0; }
          body {
            background:
              radial-gradient(1100px 500px at 90% -10%, var(--teal-tint) 0%, rgba(234,249,245,0) 60%),
              radial-gradient(900px 500px at -10% 10%, var(--blue-tint) 0%, rgba(238,241,250,0) 60%),
              var(--paper);
            font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: var(--ink);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 48px 20px;
          }

          .sheet {
            width: 100%;
            max-width: 620px;
          }

          .brandbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 28px;
          }
          .brandbar img {
            height: 180px;
            width: auto;
            display: block;
          }
          .brandbar .tag {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 11.5px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--ink-soft);
            border: 1px solid var(--line);
            background: var(--card);
            padding: 6px 12px;
            border-radius: 100px;
          }

          .card {
            background: var(--card);
            border: 1px solid var(--line);
            border-radius: var(--radius);
            box-shadow: 0 1px 2px rgba(22,26,31,0.04), 0 20px 40px -24px rgba(22,26,31,0.18);
            overflow: hidden;
          }

          .card-top {
            height: 5px;
            background: linear-gradient(90deg, var(--blue) 0%, var(--blue-light) 45%, var(--teal) 100%);
          }

          .card-header {
            padding: 36px 40px 30px;
            background:
              radial-gradient(560px 220px at 100% 0%, rgba(47,191,159,0.16) 0%, rgba(47,191,159,0) 70%),
              linear-gradient(135deg, var(--blue-tint) 0%, var(--teal-tint) 100%);
            border-bottom: 1px solid var(--line);
          }
          @media (max-width: 520px) {
            .card-header { padding: 26px 22px 22px; }
          }

          .card-body {
            padding: 36px 40px 36px;
          }

          @media (max-width: 520px) {
            .card-body { padding: 26px 22px 26px; }
          }

          .eyebrow {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 12px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--teal);
            font-weight: 500;
            margin: 0 0 10px;
          }

          h1 {
            font-size: 26px;
            line-height: 1.25;
            font-weight: 800;
            letter-spacing: -0.01em;
            margin: 0 0 10px;
            color: var(--ink);
          }

          p.lede {
            font-size: 14.5px;
            line-height: 1.6;
            color: var(--ink-soft);
            margin: 0;
            max-width: 46ch;
          }

          form { margin: 0; }

          .row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
          }
          @media (max-width: 480px) {
            .row { grid-template-columns: 1fr; }
          }

          .field {
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;
          }

          label {
            font-size: 13px;
            font-weight: 600;
            color: var(--ink);
            margin-bottom: 7px;
          }
          label .req {
            color: var(--teal);
            margin-left: 2px;
          }

          input, textarea {
            font-family: inherit;
            font-size: 14.5px;
            color: var(--ink);
            background: var(--paper);
            border: 1.5px solid var(--line);
            border-radius: 9px;
            padding: 12px 13px;
            outline: none;
            transition: border-color .15s ease, background .15s ease, box-shadow .15s ease;
            width: 100%;
          }
          input::placeholder, textarea::placeholder {
            color: #A7AEB8;
          }
          input:hover, textarea:hover {
            border-color: #C7CFD6;
          }
          input:focus, textarea:focus {
            background: #fff;
            border-color: var(--teal);
            box-shadow: 0 0 0 4px rgba(47,191,159,0.14);
          }
          textarea {
            resize: vertical;
            min-height: 96px;
            line-height: 1.5;
          }

          .field.invalid input,
          .field.invalid textarea {
            border-color: var(--danger);
            background: #FDF4F3;
          }
          .error-msg {
            font-size: 12.5px;
            color: var(--danger);
            margin-top: 6px;
            display: none;
          }
          .field.invalid .error-msg { display: block; }

          .submit-row {
            margin-top: 8px;
            display: flex;
            align-items: center;
            gap: 16px;
          }

          button.submit {
            font-family: inherit;
            font-size: 15px;
            font-weight: 700;
            color: #fff;
            background: linear-gradient(90deg, var(--blue) 0%, var(--teal) 100%);
            border: none;
            border-radius: 9px;
            padding: 13px 26px;
            cursor: pointer;
            transition: transform .12s ease, box-shadow .12s ease, opacity .12s ease;
            box-shadow: 0 8px 20px -8px rgba(46,79,163,0.55);
          }
          button.submit:hover {
            transform: translateY(-1px);
            box-shadow: 0 12px 24px -10px rgba(46,79,163,0.6);
          }
          button.submit:active {
            transform: translateY(0);
          }
          button.submit:disabled {
            opacity: 0.7;
            cursor: default;
            transform: none;
          }

          .privacy {
            font-size: 12px;
            color: var(--ink-soft);
            line-height: 1.5;
          }

          .foot {
            text-align: center;
            margin-top: 22px;
            font-size: 12px;
            color: var(--ink-soft);
          }

          /* success state */
          .success {
            display: none;
            text-align: center;
            padding: 20px 6px 6px;
          }
          .success.show { display: block; }
          form.hidden { display: none; }
          .success .check {
            width: 52px; height: 52px;
            border-radius: 50%;
            background: var(--teal-tint);
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 18px;
          }
          .success h2 {
            font-size: 20px;
            margin: 0 0 8px;
            font-weight: 800;
          }
          .success p {
            font-size: 14px;
            color: var(--ink-soft);
            margin: 0;
            line-height: 1.6;
          }
        `
      }} />

      <div className="sheet">
        <div className="brandbar">
          {/* Image source left intentionally empty for you to fill */}
          <img src="/logo.png" alt="SSInnovations" />
          <span className="tag">Physician Intake</span>
        </div>

        <div className="card">
          <div className="card-top"></div>
          <div className="card-header">
            <p className="eyebrow">Get in touch</p>
            <h1>Register your interest</h1>
            <p className="lede">Share your details and our team will reach out to discuss how SSInnovations can support your practice.</p>
          </div>
          <div className="card-body">

            <form 
              id="docForm" 
              noValidate 
              onSubmit={handleSubmit}
              className={isSuccess ? 'hidden' : ''}
            >
              <div className="row">
                <div className={`field ${errors.firstName ? 'invalid' : ''}`}>
                  <label htmlFor="firstName">First name<span className="req">*</span></label>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    placeholder="Ananya" 
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <span className="error-msg">Please enter your first name.</span>
                </div>
                <div className={`field ${errors.lastName ? 'invalid' : ''}`}>
                  <label htmlFor="lastName">Last name<span className="req">*</span></label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    placeholder="Rao" 
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  <span className="error-msg">Please enter your last name.</span>
                </div>
              </div>

              <div className="row">
                <div className={`field ${errors.email ? 'invalid' : ''}`}>
                  <label htmlFor="email">Email<span className="req">*</span></label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="you@hospital.com" 
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <span className="error-msg">Please enter a valid email address.</span>
                </div>
                <div className={`field ${errors.phone ? 'invalid' : ''}`}>
                  <label htmlFor="phone">Phone number<span className="req">*</span></label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    placeholder="+91 98765 43210" 
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <span className="error-msg">Please enter a valid phone number.</span>
                </div>
              </div>

              <div className="row">
                <div className={`field ${errors.hospital ? 'invalid' : ''}`}>
                  <label htmlFor="hospital">Hospital<span className="req">*</span></label>
                  <input 
                    type="text" 
                    id="hospital" 
                    name="hospital" 
                    placeholder="Hospital or institution name" 
                    autoComplete="organization"
                    value={formData.hospital}
                    onChange={handleChange}
                  />
                  <span className="error-msg">Please enter your hospital or institution.</span>
                </div>
                <div className="field">
                  <label htmlFor="specialty">Specialty</label>
                  <input 
                    type="text" 
                    id="specialty" 
                    name="specialty" 
                    placeholder="e.g. General Surgery"
                    value={formData.specialty}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="remark">Remark</label>
                <textarea 
                  id="remark" 
                  name="remark" 
                  placeholder="Tell us a little about what you're looking for (optional)"
                  value={formData.remark}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="submit-row">
                <button type="submit" className="submit" id="submitBtn" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting…' : 'Submit registration'}
                </button>
                <span className="privacy">Your information is kept confidential.</span>
              </div>
              {submitError ? <p className="privacy" style={{ color: 'var(--danger)', marginTop: '10px' }}>{submitError}</p> : null}
            </form>

            <div className={`success ${isSuccess ? 'show' : ''}`} id="successState">
              <div className="check">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 12.5L9.5 18L20 6" stroke="#2FBF9F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2>Thank you, <span id="successName">{formData.firstName}</span></h2>
              <p>We've received your registration. Our team will contact you shortly.</p>
            </div>

          </div>
        </div>

        <p className="foot">© 2026 SSInnovations. All rights reserved.</p>
      </div>
    </>
  );
}