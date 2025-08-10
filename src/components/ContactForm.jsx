import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ContactForm({ onClose }) {
    const [formData, setFormData] = useState({
        naam: '',
        email: '',
        telefoon: '',
        onderwerp: '',
        bericht: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('contact_berichten')
                .insert([{
                    naam: formData.naam,
                    email: formData.email,
                    telefoon: formData.telefoon || null,
                    onderwerp: formData.onderwerp,
                    bericht: formData.bericht,
                    datum: new Date().toISOString()
                }]);

            if (error) {
                console.error('Error submitting contact form:', error);
                alert('Er is een fout opgetreden bij het versturen van je bericht. Probeer het opnieuw.');
            } else {
                setIsSubmitted(true);
                // Auto-close after 3 seconds
                setTimeout(() => {
                    onClose();
                }, 3000);
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            alert('Er is een fout opgetreden bij het versturen van je bericht. Probeer het opnieuw.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (isSubmitted) {
        return (
            <div className="contact-form-overlay">
                <div className="contact-form-modal">
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                        <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Bericht verzonden!</h2>
                        <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
                            Bedankt voor je bericht. We nemen zo snel mogelijk contact met je op.
                        </p>
                        <button 
                            onClick={onClose}
                            className="primary-button"
                        >
                            Sluiten
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="contact-form-overlay">
            <div className="contact-form-modal">
                <div className="contact-form-header">
                    <h2>Contact opnemen</h2>
                    <button 
                        onClick={onClose}
                        className="contact-form-close"
                        type="button"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="contact-form-group">
                        <label>Naam *</label>
                        <input
                            type="text"
                            value={formData.naam}
                            onChange={(e) => handleInputChange('naam', e.target.value)}
                            required
                            className="contact-form-input"
                            placeholder="Uw volledige naam"
                        />
                    </div>

                    <div className="contact-form-group">
                        <label>E-mailadres *</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                            className="contact-form-input"
                            placeholder="uw@email.nl"
                        />
                    </div>

                    <div className="contact-form-group">
                        <label>Telefoonnummer</label>
                        <input
                            type="tel"
                            value={formData.telefoon}
                            onChange={(e) => handleInputChange('telefoon', e.target.value)}
                            className="contact-form-input"
                            placeholder="06 12345678"
                        />
                    </div>

                    <div className="contact-form-group">
                        <label>Onderwerp *</label>
                        <select
                            value={formData.onderwerp}
                            onChange={(e) => handleInputChange('onderwerp', e.target.value)}
                            required
                            className="contact-form-input"
                        >
                            <option value="">Selecteer een onderwerp</option>
                            <option value="Algemene vraag">Algemene vraag</option>
                            <option value="Lease aanvraag">Lease aanvraag</option>
                            <option value="Prijsinformatie">Prijsinformatie</option>
                            <option value="Technische ondersteuning">Technische ondersteuning</option>
                            <option value="Klacht">Klacht</option>
                            <option value="Anders">Anders</option>
                        </select>
                    </div>

                    <div className="contact-form-group">
                        <label>Bericht *</label>
                        <textarea
                            value={formData.bericht}
                            onChange={(e) => handleInputChange('bericht', e.target.value)}
                            required
                            className="contact-form-textarea"
                            placeholder="Vertel ons hoe we je kunnen helpen..."
                            rows={4}
                        />
                    </div>

                    <div className="contact-form-actions">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="secondary-button"
                            disabled={isSubmitting}
                        >
                            Annuleren
                        </button>
                        <button 
                            type="submit"
                            className="primary-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Versturen...' : 'Bericht versturen'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
