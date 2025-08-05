import React, { useState, useEffect } from 'react';

const looptijden = [12, 24, 36, 48, 60, 72];
const BTW_PERCENTAGE = 0.21;

// Airtable configuratie voor voertuigen
const AIRTABLE_TOKEN = import.meta.env.VITE_AIRTABLE_API_KEY || 'patlA8VoCdqHS9GkQ.63999c29a21d80a36c4617805edcd765fc4d87d1397ea34f0fa03e698f5b98bf';
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID || 'appWGgRPKQ3yvx3zd';
const TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME || 'Voertuigen';

const dummyVoertuigen = [
    { id: '1', fields: { Merk: 'Selecteer een voertuig', Model: '', Prijs: 0 } },
    { id: '2', fields: { Merk: 'BMW', Model: 'X3 xDrive20i', Prijs: 63883 } },
    { id: '3', fields: { Merk: 'Audi', Model: 'A4 Avant', Prijs: 59000 } },
    { id: '4', fields: { Merk: 'Mercedes', Model: 'C-Klasse', Prijs: 68000 } }
];

const formatCurrency = (value) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value || 0);
};

const formatNumber = (value) => {
    return new Intl.NumberFormat('nl-NL', { useGrouping: true }).format(value || 0);
};

const InfoTooltip = ({ text }) => (
    <span className="info-tooltip" data-text={text}>?</span>
);

const CurrencyInput = ({ label, value, setValue }) => (
    <div className="input-group">
        <label>{label} <InfoTooltip text={`Stel de ${label.toLowerCase()} in.`} /></label>
        <div className="input-box">
            €
            <input
                type="text"
                value={formatNumber(value)}
                onChange={(e) => {
                    const numericValue = Number(e.target.value.replace(/\./g, '').replace(/,/g, '.'));
                    if (!isNaN(numericValue)) {
                        setValue(numericValue);
                    }
                }}
            />
        </div>
    </div>
);

// Private Lease Form Component
const PrivateLeaseForm = ({ selectedVoertuig, onComplete }) => {
    // Test environment variables on component mount
    React.useEffect(() => {
        console.log('=== PRIVATE LEASE FORM MOUNTED ===');
        console.log('Environment variables check:');
        console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
        console.log('VITE_SUPABASE_ANON_KEY present:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
        console.log('Full import.meta.env:', import.meta.env);
        
        // Test Supabase connection immediately
        const testSupabaseConnection = async () => {
            try {
                console.log('🔄 Testing Supabase connection...');
                const { createClient } = await import('@supabase/supabase-js');
                const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
                const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
                
                if (!supabaseUrl || !supabaseKey) {
                    console.error('❌ Environment variables missing');
                    console.log('URL:', supabaseUrl);
                    console.log('Key present:', !!supabaseKey);
                    return;
                }
                
                const supabase = createClient(supabaseUrl, supabaseKey);
                console.log('✅ Supabase client created');
                
                const { data, error } = await supabase
                    .from('lease_aanvragen')
                    .select('*')
                    .limit(1);
                    
                if (error) {
                    console.error('❌ Supabase connection failed:', error.message);
                } else {
                    console.log('✅ Supabase connection successful');
                    console.log('📊 Found', data.length, 'records');
                }
            } catch (error) {
                console.error('❌ Error testing Supabase:', error);
            }
        };
        
        testSupabaseConnection();
    }, []);

    const [formData, setFormData] = useState({
        verkoopprijs: selectedVoertuig?.fields?.Prijs || 0,
        aanbetaling: 0,
        gewenstKrediet: 0,
        looptijd: 48,
        kenteken: '',
        aanhef: 'Dhr.',
        voorletters: '',
        achternaam: '',
        geboortedatum: '',
        burgerlijkeStaat: 'Alleenstaand',
        straatnaam: '',
        huisnummer: '',
        huisnummerToevoeging: '',
        postcode: '',
        woonplaats: '',
        telefoonnummer: '',
        email: '',
        dienstverband: 'Vast',
        beroep: '',
        ingangsdatumDienstverband: '',
        einddatumDienstverband: '',
        brutoInkomen: 0,
        woonsituatie: 'Koopwoning',
        maandelijkseWoonlast: 0,
        voorwaardenGeaccepteerd: false,
        // Extra producten
        laadpaal: false,
        zonnepanelen: false,
        verzekering: false,
        tankpas: false,
        inrichtingBedrijfsauto: false,
        autoBelettering: false,
        totaalOpties: 0
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const looptijden = [12, 24, 36, 48, 60, 72];
    const aanhefOpties = ['Dhr.', 'Mevr.'];
    const burgerlijkeStaatOpties = ['Alleenstaand', 'Gehuwd', 'Samenwonend', 'Gescheiden', 'Weduwe/Weduwnaar'];
    const dienstverbandOpties = ['Vast', 'Tijdelijk', 'Zelfstandig', 'Pensioen', 'Uitkering'];
    const woonsituatieOpties = ['Koopwoning', 'Huurwoning', 'Huurwoning sociale sector', 'Bij ouders', 'Anders'];

    // Update verkoopprijs when selectedVoertuig changes
    React.useEffect(() => {
        if (selectedVoertuig?.fields?.Prijs) {
            setFormData(prev => ({
                ...prev,
                verkoopprijs: selectedVoertuig.fields.Prijs
            }));
        }
    }, [selectedVoertuig]);

    const calculateGewenstKrediet = () => {
        return formData.verkoopprijs - formData.aanbetaling;
    };

    const calculateMaandlast = (looptijd = formData.looptijd) => {
        const krediet = calculateGewenstKrediet();
        const rente = 0.05; // 5% jaarlijkse rente
        const maandelijkseRente = rente / 12;
        const aantalMaanden = looptijd;
        
        if (krediet > 0 && aantalMaanden > 0) {
            return (krediet * maandelijkseRente * Math.pow(1 + maandelijkseRente, aantalMaanden)) / 
                   (Math.pow(1 + maandelijkseRente, aantalMaanden) - 1);
        }
        return 0;
    };

    const calculateExtraProductenTotaal = () => {
        let totaal = 0;
        if (formData.laadpaal) totaal += 25;
        if (formData.zonnepanelen) totaal += 35;
        if (formData.verzekering) totaal += 45;
        if (formData.tankpas) totaal += 15;
        if (formData.inrichtingBedrijfsauto) totaal += 30;
        if (formData.autoBelettering) totaal += 20;
        return totaal;
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.voorletters) newErrors.voorletters = 'Naam is verplicht';
        if (!formData.achternaam) newErrors.achternaam = 'Achternaam is verplicht';
        if (!formData.geboortedatum) newErrors.geboortedatum = 'Geboortedatum is verplicht';
        if (!formData.straatnaam) newErrors.straatnaam = 'Straatnaam is verplicht';
        if (!formData.huisnummer) newErrors.huisnummer = 'Huisnummer is verplicht';
        if (!formData.postcode) newErrors.postcode = 'Postcode is verplicht';
        if (!formData.woonplaats) newErrors.woonplaats = 'Woonplaats is verplicht';
        if (!formData.telefoonnummer) newErrors.telefoonnummer = 'Telefoonnummer is verplicht';
        if (!formData.email) newErrors.email = 'Email is verplicht';
        if (!formData.voorwaardenGeaccepteerd) newErrors.voorwaardenGeaccepteerd = 'U moet de voorwaarden accepteren';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitToSupabase = async (data) => {
        console.log('=== PRIVATE LEASE FORM SUBMISSION START ===');
        console.log('Form data received:', data);
        console.log('Selected vehicle:', selectedVoertuig);
        
        // Debug environment variables
        console.log('🔍 Environment variables check:');
        console.log('import.meta.env:', import.meta.env);
        console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
        console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
        
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Import Supabase client
            console.log('🔄 Importing Supabase client...');
            const { createClient } = await import('@supabase/supabase-js');
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
            
            console.log('Environment variables:');
            console.log('- VITE_SUPABASE_URL:', supabaseUrl ? '✅ Found' : '❌ Missing');
            console.log('- VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Found' : '❌ Missing');
            
            if (!supabaseUrl || !supabaseKey) {
                console.error('❌ Supabase credentials not found');
                console.error('URL:', supabaseUrl);
                console.error('Key present:', !!supabaseKey);
                setSubmitStatus('error');
                return;
            }

            const supabase = createClient(supabaseUrl, supabaseKey);
            console.log('✅ Supabase client created successfully');
            
            const submissionData = {
                voornaam: data.voorletters,
                achternaam: data.achternaam,
                email: data.email,
                telefoon: data.telefoonnummer,
                lease_type: 'Private Lease',
                voertuig: `${selectedVoertuig?.fields?.Merk} ${selectedVoertuig?.fields?.Model}`,
                aanbetaling: data.aanbetaling || 0,
                slotsom: 0, // Private lease heeft geen slotsom
                looptijd: data.looptijd || 0,
                maandbedrag: data.maandbedrag || 0,
                totaal_maandbedrag: data.maandbedrag || 0,
                status: 'Nieuw',
                // Private lease specifieke velden
                verkoopprijs: data.verkoopprijs || 0,
                gewenst_krediet: data.gewenstKrediet || 0,
                kenteken: data.kenteken || '',
                aanhef: data.aanhef || '',
                geboortedatum: data.geboortedatum || '',
                burgerlijke_staat: data.burgerlijkeStaat || '',
                straat: data.straatnaam || '', // Aangepast naar 'straat' om overeen te komen met database
                huisnummer: data.huisnummer || '',
                huisnummer_toevoeging: data.huisnummerToevoeging || '',
                postcode: data.postcode || '',
                woonplaats: data.woonplaats || '',
                dienstverband: data.dienstverband || '',
                beroep: data.beroep || '',
                ingangsdatum_dienstverband: data.ingangsdatumDienstverband || '',
                einddatum_dienstverband: data.einddatumDienstverband || '',
                bruto_inkomen: data.brutoInkomen || 0,
                woonsituatie: data.woonsituatie || '',
                maandelijkse_woonlast: data.maandelijkseWoonlast || 0,
                // Extra producten voor Private Lease
                laadpaal: data.laadpaal || false,
                zonnepanelen: data.zonnepanelen || false,
                verzekering: data.verzekering || false,
                tankpas: data.tankpas || false,
                inrichting_bedrijfsauto: data.inrichtingBedrijfsauto || false,
                auto_belettering: data.autoBelettering || false,
                totaal_opties: data.totaalOpties || 0
            };

            console.log('Final submission data:', submissionData);
            console.log('🔄 Attempting to save to Supabase...');
            
            const { data: result, error } = await supabase
                .from('lease_aanvragen')
                .insert([submissionData])
                .select();

            if (error) {
                console.error('❌ Supabase error:', error.message);
                console.log('📊 Supabase error details:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
                
                // Als het een kolom error is, probeer dan een eenvoudigere insert
                if (error.code === 'PGRST204') {
                    console.log('🔄 Column error detected, trying simpler insert...');
                    const simpleData = {
                        voornaam: data.voorletters,
                        achternaam: data.achternaam,
                        email: data.email,
                        telefoon: data.telefoonnummer,
                        lease_type: 'Private Lease',
                        voertuig: `${selectedVoertuig?.fields?.Merk} ${selectedVoertuig?.fields?.Model}`,
                        maandbedrag: data.maandbedrag || 0,
                        status: 'Nieuw',
                        // Belangrijke adresgegevens
                        straat: data.straatnaam || '', // Aangepast naar 'straat' om overeen te komen met database
                        huisnummer: data.huisnummer || '',
                        postcode: data.postcode || '',
                        woonplaats: data.woonplaats || ''
                    };
                    
                    console.log('Simple data:', simpleData);
                    
                    const { data: simpleResult, error: simpleError } = await supabase
                        .from('lease_aanvragen')
                        .insert([simpleData])
                        .select();
                        
                    if (simpleError) {
                        console.error('❌ Simple insert also failed:', simpleError);
                        setSubmitStatus('error');
                    } else {
                        console.log('✅ Simple insert successful:', simpleResult);
                        setSubmitStatus('success');
                    }
                } else {
                    setSubmitStatus('error');
                }
            } else {
                console.log('✅ Supabase insert successful:', result);
                setSubmitStatus('success');
            }
        } catch (error) {
            console.error('❌ Error in form submission:', error);
            console.error('Error stack:', error.stack);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
            console.log('=== PRIVATE LEASE FORM SUBMISSION END ===');
        }
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const extraProductenTotaal = calculateExtraProductenTotaal();
            const submissionData = {
                leaseType: 'particulier',
                selectedVoertuig: `${selectedVoertuig?.fields?.Merk} ${selectedVoertuig?.fields?.Model}`,
                ...formData,
                gewenstKrediet: calculateGewenstKrediet(),
                maandbedrag: calculateMaandlast(),
                looptijd: formData.looptijd,
                totaalOpties: extraProductenTotaal
            };
            
            submitToSupabase(submissionData);
        }
    };

    return (
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
            <h3>Private Lease Aanvraag</h3>
            
            {submitStatus === 'success' && (
                <div style={{ 
                    padding: '15px', 
                    marginBottom: '20px', 
                    backgroundColor: '#d4edda', 
                    color: '#155724', 
                    borderRadius: '4px',
                    border: '1px solid #c3e6cb'
                }}>
                    ✅ Uw private lease aanvraag is succesvol ingediend! We nemen binnen 24 uur contact met u op.
                </div>
            )}
            
            {submitStatus === 'error' && (
                <div style={{ 
                    padding: '15px', 
                    marginBottom: '20px', 
                    backgroundColor: '#f8d7da', 
                    color: '#721c24', 
                    borderRadius: '4px',
                    border: '1px solid #f5c6cb'
                }}>
                    ❌ Er is een fout opgetreden. Probeer het later opnieuw.
                </div>
            )}
            
            {submitStatus === 'success' ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <h4>Bedankt voor uw aanvraag!</h4>
                    <p>We hebben uw private lease aanvraag ontvangen en nemen binnen 24 uur contact met u op.</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '12px 24px',
                            border: 'none',
                            background: '#d846b4',
                            color: 'white',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        Nieuwe aanvraag
                    </button>
                </div>
            ) : (
                <>
                    {/* 1. Financiering */}
                    <div style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <h4>1. Financiering</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label>Verkoopprijs</label>
                                <input
                                    type="number"
                                    value={formData.verkoopprijs}
                                    readOnly
                                    style={{ 
                                        width: '100%', 
                                        padding: '10px', 
                                        border: '1px solid #ddd', 
                                        borderRadius: '4px',
                                        backgroundColor: '#f5f5f5',
                                        color: '#666'
                                    }}
                                />
                            </div>
                            <div>
                                <label>Aanbetaling/inruil bedrag</label>
                                <input
                                    type="number"
                                    value={formData.aanbetaling}
                                    onChange={(e) => setFormData({...formData, aanbetaling: Number(e.target.value)})}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            <div>
                                <label>Uw gewenst krediet</label>
                                <input
                                    type="number"
                                    value={calculateGewenstKrediet()}
                                    disabled
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', background: '#f5f5f5' }}
                                />
                            </div>
                            <div>
                                <label>Gewenste looptijd in maanden</label>
                                <div style={{ marginTop: '10px' }}>
                                    {looptijden.map(lt => {
                                        const bedrag = calculateMaandlast(lt);
                                        const isMeestGekozen = lt === 48; // Private lease meest gekozen is 48 maanden
                                        return (
                                            <label key={lt} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '12px 16px',
                                                marginBottom: '8px',
                                                backgroundColor: 'white',
                                                borderRadius: '8px',
                                                border: '1px solid #e0e0e0',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}>
                                                <input
                                                    type="radio"
                                                    name="looptijd"
                                                    value={lt}
                                                    checked={formData.looptijd === lt}
                                                    onChange={() => setFormData({...formData, looptijd: lt})}
                                                    style={{ marginRight: '12px' }}
                                                />
                                                <span style={{ 
                                                    flex: 1, 
                                                    fontWeight: formData.looptijd === lt ? 'bold' : 'normal',
                                                    color: formData.looptijd === lt ? '#d846b4' : '#333'
                                                }}>
                                                    {lt} maanden
                                                    {isMeestGekozen && (
                                                        <span style={{
                                                            marginLeft: '8px',
                                                            padding: '2px 8px',
                                                            backgroundColor: '#e3f2fd',
                                                            color: '#1976d2',
                                                            borderRadius: '12px',
                                                            fontSize: '12px',
                                                            fontWeight: 'normal'
                                                        }}>
                                                            meest gekozen
                                                        </span>
                                                    )}
                                                </span>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    backgroundColor: '#e3f2fd',
                                                    color: '#1976d2',
                                                    borderRadius: '16px',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {formatCurrency(bedrag)}<span style={{ fontSize: '12px', fontWeight: 'normal' }}>/maand</span>
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: '20px', padding: '15px', background: '#f0f8ff', borderRadius: '4px' }}>
                            <strong>Maandlast vanaf: {formatCurrency(calculateMaandlast())}</strong>
                        </div>
                    </div>

                    {/* Extra Producten */}
                    <div style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <h4>Extra Producten (Optioneel)</h4>
                        <p style={{ color: '#666', marginBottom: '20px' }}>Kies de extra producten die u wenst toe te voegen aan uw lease</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.laadpaal}
                                    onChange={(e) => setFormData({...formData, laadpaal: e.target.checked})}
                                    style={{ width: '20px', height: '20px' }}
                                />
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>Laadpaal</label>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>€25/maand</p>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.zonnepanelen}
                                    onChange={(e) => setFormData({...formData, zonnepanelen: e.target.checked})}
                                    style={{ width: '20px', height: '20px' }}
                                />
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>Zonnepanelen</label>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>€35/maand</p>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.verzekering}
                                    onChange={(e) => setFormData({...formData, verzekering: e.target.checked})}
                                    style={{ width: '20px', height: '20px' }}
                                />
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>Verzekering</label>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>€45/maand</p>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.tankpas}
                                    onChange={(e) => setFormData({...formData, tankpas: e.target.checked})}
                                    style={{ width: '20px', height: '20px' }}
                                />
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>Tankpas</label>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>€15/maand</p>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.inrichtingBedrijfsauto}
                                    onChange={(e) => setFormData({...formData, inrichtingBedrijfsauto: e.target.checked})}
                                    style={{ width: '20px', height: '20px' }}
                                />
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>Inrichting Bedrijfsauto</label>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>€30/maand</p>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.autoBelettering}
                                    onChange={(e) => setFormData({...formData, autoBelettering: e.target.checked})}
                                    style={{ width: '20px', height: '20px' }}
                                />
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>Auto Belettering</label>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>€20/maand</p>
                                </div>
                            </div>
                        </div>
                        
                        <div style={{ 
                            marginTop: '20px', 
                            padding: '15px', 
                            background: '#f0f8ff', 
                            borderRadius: '4px',
                            border: '1px solid #d0e7ff'
                        }}>
                            <strong>Extra producten totaal: {formatCurrency(calculateExtraProductenTotaal())}/maand</strong>
                        </div>
                    </div>

                    {/* Totaal Bedrag - alleen tonen als er extra producten zijn */}
                    {calculateExtraProductenTotaal() > 0 && (
                        <div style={{ 
                            marginBottom: '30px', 
                            padding: '20px', 
                            background: 'linear-gradient(135deg, #d846b4 0%, #c2185b 100%)',
                            borderRadius: '8px',
                            color: 'white',
                            textAlign: 'center'
                        }}>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>Totaal Maandbedrag</h3>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
                                {formatCurrency(calculateMaandlast() + calculateExtraProductenTotaal())}
                                <span style={{ fontSize: '16px', fontWeight: 'normal' }}>/maand</span>
                            </div>
                            <div style={{ fontSize: '14px', opacity: 0.9 }}>
                                Lease: {formatCurrency(calculateMaandlast())} + Extra producten: {formatCurrency(calculateExtraProductenTotaal())}
                            </div>
                        </div>
                    )}

                    {/* 2. Voertuiggegevens */}
                    <div style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <h4>2. Voertuiggegevens</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label>Merk</label>
                                <input
                                    type="text"
                                    value={selectedVoertuig?.fields?.Merk || ''}
                                    disabled
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', background: '#f5f5f5' }}
                                />
                            </div>
                            <div>
                                <label>Type</label>
                                <input
                                    type="text"
                                    value={selectedVoertuig?.fields?.Model || ''}
                                    disabled
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', background: '#f5f5f5' }}
                                />
                            </div>
                            <div>
                                <label>Kenteken van voertuig</label>
                                <input
                                    type="text"
                                    value={formData.kenteken}
                                    onChange={(e) => setFormData({...formData, kenteken: e.target.value})}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3. Persoonsgegevens */}
                    <div style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <h4>3. Persoonsgegevens</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label>Aanhef</label>
                                <select
                                    value={formData.aanhef}
                                    onChange={(e) => setFormData({...formData, aanhef: e.target.value})}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                >
                                    {aanhefOpties.map(optie => (
                                        <option key={optie} value={optie}>{optie}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Naam *</label>
                                <input
                                    type="text"
                                    value={formData.voorletters}
                                    onChange={(e) => setFormData({...formData, voorletters: e.target.value})}
                                    placeholder="Vul uw volledige naam in"
                                    style={{ 
                                        width: '100%', 
                                        padding: '10px', 
                                        border: errors.voorletters ? '1px solid #ff0000' : '1px solid #ddd', 
                                        borderRadius: '4px' 
                                    }}
                                />
                                {errors.voorletters && <span style={{ color: '#ff0000', fontSize: '12px' }}>{errors.voorletters}</span>}
                            </div>
                            <div>
                                <label>Achternaam *</label>
                                <input
                                    type="text"
                                    value={formData.achternaam}
                                    onChange={(e) => setFormData({...formData, achternaam: e.target.value})}
                                    style={{ 
                                        width: '100%', 
                                        padding: '10px', 
                                        border: errors.achternaam ? '1px solid #ff0000' : '1px solid #ddd', 
                                        borderRadius: '4px' 
                                    }}
                                />
                                {errors.achternaam && <span style={{ color: '#ff0000', fontSize: '12px' }}>{errors.achternaam}</span>}
                            </div>
                            <div>
                                <label>Geboortedatum *</label>
                                <input
                                    type="date"
                                    value={formData.geboortedatum}
                                    onChange={(e) => setFormData({...formData, geboortedatum: e.target.value})}
                                    style={{ 
                                        width: '100%', 
                                        padding: '10px', 
                                        border: errors.geboortedatum ? '1px solid #ff0000' : '1px solid #ddd', 
                                        borderRadius: '4px' 
                                    }}
                                />
                                {errors.geboortedatum && <span style={{ color: '#ff0000', fontSize: '12px' }}>{errors.geboortedatum}</span>}
                            </div>
                            <div>
                                <label>Burgerlijke staat</label>
                                <select
                                    value={formData.burgerlijkeStaat}
                                    onChange={(e) => setFormData({...formData, burgerlijkeStaat: e.target.value})}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                >
                                    {burgerlijkeStaatOpties.map(optie => (
                                        <option key={optie} value={optie}>{optie}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 4. Contactgegevens */}
                    <div style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <h4>4. Contactgegevens</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label>Straatnaam *</label>
                                <input
                                    type="text"
                                    value={formData.straatnaam}
                                    onChange={(e) => setFormData({...formData, straatnaam: e.target.value})}
                                    style={{ 
                                        width: '100%', 
                                        padding: '10px', 
                                        border: errors.straatnaam ? '1px solid #ff0000' : '1px solid #ddd', 
                                        borderRadius: '4px' 
                                    }}
                                />
                                {errors.straatnaam && <span style={{ color: '#ff0000', fontSize: '12px' }}>{errors.straatnaam}</span>}
                            </div>
                            <div>
                                <label>Huisnummer *</label>
                                <input
                                    type="text"
                                    value={formData.huisnummer}
                                    onChange={(e) => setFormData({...formData, huisnummer: e.target.value})}
                                    style={{ 
                                        width: '100%', 
                                        padding: '10px', 
                                        border: errors.huisnummer ? '1px solid #ff0000' : '1px solid #ddd', 
                                        borderRadius: '4px' 
                                    }}
                                />
                                {errors.huisnummer && <span style={{ color: '#ff0000', fontSize: '12px' }}>{errors.huisnummer}</span>}
                            </div>
                            <div>
                                <label>Huisnummer toevoeging</label>
                                <input
                                    type="text"
                                    value={formData.huisnummerToevoeging}
                                    onChange={(e) => setFormData({...formData, huisnummerToevoeging: e.target.value})}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            <div>
                                <label>Postcode *</label>
                                <input
                                    type="text"
                                    value={formData.postcode}
                                    onChange={(e) => setFormData({...formData, postcode: e.target.value})}
                                    style={{ 
                                        width: '100%', 
                                        padding: '10px', 
                                        border: errors.postcode ? '1px solid #ff0000' : '1px solid #ddd', 
                                        borderRadius: '4px' 
                                    }}
                                />
                                {errors.postcode && <span style={{ color: '#ff0000', fontSize: '12px' }}>{errors.postcode}</span>}
                            </div>
                            <div>
                                <label>Woonplaats *</label>
                                <input
                                    type="text"
                                    value={formData.woonplaats}
                                    onChange={(e) => setFormData({...formData, woonplaats: e.target.value})}
                                    style={{ 
                                        width: '100%', 
                                        padding: '10px', 
                                        border: errors.woonplaats ? '1px solid #ff0000' : '1px solid #ddd', 
                                        borderRadius: '4px' 
                                    }}
                                />
                                {errors.woonplaats && <span style={{ color: '#ff0000', fontSize: '12px' }}>{errors.woonplaats}</span>}
                            </div>
                            <div>
                                <label>Telefoonnummer *</label>
                                <input
                                    type="tel"
                                    value={formData.telefoonnummer}
                                    onChange={(e) => setFormData({...formData, telefoonnummer: e.target.value})}
                                    style={{ 
                                        width: '100%', 
                                        padding: '10px', 
                                        border: errors.telefoonnummer ? '1px solid #ff0000' : '1px solid #ddd', 
                                        borderRadius: '4px' 
                                    }}
                                />
                                {errors.telefoonnummer && <span style={{ color: '#ff0000', fontSize: '12px' }}>{errors.telefoonnummer}</span>}
                            </div>
                            <div>
                                <label>Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    style={{ 
                                        width: '100%', 
                                        padding: '10px', 
                                        border: errors.email ? '1px solid #ff0000' : '1px solid #ddd', 
                                        borderRadius: '4px' 
                                    }}
                                />
                                {errors.email && <span style={{ color: '#ff0000', fontSize: '12px' }}>{errors.email}</span>}
                            </div>
                        </div>
                    </div>

                    {/* 5. Financiële gegevens */}
                    <div style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <h4>5. Financiële gegevens</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label>Dienstverband</label>
                                <select
                                    value={formData.dienstverband}
                                    onChange={(e) => setFormData({...formData, dienstverband: e.target.value})}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                >
                                    {dienstverbandOpties.map(optie => (
                                        <option key={optie} value={optie}>{optie}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Beroep</label>
                                <input
                                    type="text"
                                    value={formData.beroep}
                                    onChange={(e) => setFormData({...formData, beroep: e.target.value})}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            <div>
                                <label>Ingangsdatum dienstverband</label>
                                <input
                                    type="date"
                                    value={formData.ingangsdatumDienstverband}
                                    onChange={(e) => setFormData({...formData, ingangsdatumDienstverband: e.target.value})}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            <div>
                                <label>Einddatum dienstverband</label>
                                <input
                                    type="date"
                                    value={formData.einddatumDienstverband}
                                    onChange={(e) => setFormData({...formData, einddatumDienstverband: e.target.value})}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            <div>
                                <label>Bruto inkomen</label>
                                <input
                                    type="number"
                                    value={formData.brutoInkomen}
                                    onChange={(e) => setFormData({...formData, brutoInkomen: Number(e.target.value)})}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            <div>
                                <label>Woonsituatie</label>
                                <select
                                    value={formData.woonsituatie}
                                    onChange={(e) => setFormData({...formData, woonsituatie: e.target.value})}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                >
                                    {woonsituatieOpties.map(optie => (
                                        <option key={optie} value={optie}>{optie}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Maandelijkse woonlast</label>
                                <input
                                    type="number"
                                    value={formData.maandelijkseWoonlast}
                                    onChange={(e) => setFormData({...formData, maandelijkseWoonlast: Number(e.target.value)})}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Voorwaarden */}
                    <div style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                checked={formData.voorwaardenGeaccepteerd}
                                onChange={(e) => setFormData({...formData, voorwaardenGeaccepteerd: e.target.checked})}
                                style={{ width: '20px', height: '20px' }}
                            />
                            <label>Ik ga akkoord met de voorwaarden *</label>
                        </div>
                        {errors.voorwaardenGeaccepteerd && (
                            <span style={{ color: '#ff0000', fontSize: '12px', marginLeft: '30px' }}>
                                {errors.voorwaardenGeaccepteerd}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        style={{
                            padding: '12px 24px',
                            border: 'none',
                            background: isSubmitting ? '#ccc' : '#d846b4',
                            color: 'white',
                            borderRadius: '4px',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        {isSubmitting ? 'Bezig met versturen...' : 'Aanvraag versturen'}
                    </button>
                </>
            )}
        </div>
    );
};

export default function LeaseForm({ onComplete }) {
    const [leaseType, setLeaseType] = useState('zakelijk');
    const [voertuigen, setVoertuigen] = useState(dummyVoertuigen);
    const [selectedVoertuigId, setSelectedVoertuigId] = useState(voertuigen[1].id);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Zet standaard aanbetaling op 0
    const [aanbetaling, setAanbetaling] = useState(0);
    // Slotsom state - standaard 15% van aanschafwaarde, max 10.000
    const maxSlotsom = 10000;
    const defaultSlotsom = Math.min(Math.round((voertuigen.find(v => v.id === selectedVoertuigId)?.fields.Prijs || 0) * 0.15), maxSlotsom);
    const [slotsom, setSlotsom] = useState(defaultSlotsom);

    const [looptijd, setLooptijd] = useState(60);

    // Marketing teksten en animatie (moet binnen de component staan)
    const marketingTeksten = [
        'Financial Lease binnen 2 minuten',
        'Automatische goedkeuringen',
        'Status updates via Whatsapp'
    ];
    const [marketingIndex, setMarketingIndex] = useState(() => Math.floor(Math.random() * marketingTeksten.length));
    useEffect(() => {
        const interval = setInterval(() => {
            setMarketingIndex(prev => (prev + 1) % marketingTeksten.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);
    const randomMarketing = marketingTeksten[marketingIndex];

    // Update slotsom wanneer voertuig verandert
    useEffect(() => {
        const newDefaultSlotsom = Math.min(Math.round((voertuigen.find(v => v.id === selectedVoertuigId)?.fields.Prijs || 0) * 0.15), maxSlotsom);
        setSlotsom(newDefaultSlotsom);
    }, [selectedVoertuigId, voertuigen]);

    useEffect(() => {
        const fetchVoertuigen = async () => {
            if (!AIRTABLE_TOKEN || !BASE_ID || !TABLE_NAME) {
                console.warn("Airtable credentials not found, using dummy data.");
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`, {
                    headers: { 'Authorization': `Bearer ${AIRTABLE_TOKEN}` },
                });
                if (!response.ok) throw new Error(`Airtable fetch failed: ${response.status}`);
                const data = await response.json();
                const fetchedVoertuigen = data.records.filter(rec => rec.fields.Merk && rec.fields.Prijs > 0);
                if (fetchedVoertuigen.length > 0) {
                    setVoertuigen([dummyVoertuigen[0], ...fetchedVoertuigen]);
                    setSelectedVoertuigId(fetchedVoertuigen[0].id);
                } else {
                     throw new Error("No valid vehicles found in Airtable.");
                }
            } catch (err) {
                console.error('Error fetching voertuigen:', err);
                setError('Kon voertuigen niet laden. Probeer het later opnieuw.');
                // Keep dummy data on error
            } finally {
                setLoading(false);
            }
        };
        fetchVoertuigen();
    }, []);

    const selectedVoertuig = voertuigen.find(v => v.id === selectedVoertuigId);
    const aanschafwaardeInclBTW = selectedVoertuig?.fields.Prijs || 0;
    const btwBedrag = aanschafwaardeInclBTW - (aanschafwaardeInclBTW / (1 + BTW_PERCENTAGE));
    const aanschafwaardeExclBTW = aanschafwaardeInclBTW - btwBedrag;

    const financiering = (leaseType === 'zakelijk' ? aanschafwaardeExclBTW : aanschafwaardeInclBTW) - aanbetaling;
    const teFinancierenNaSlotsom = financiering - slotsom;
    
    const rentevoet = 0.069;
    const maandelijkseRente = rentevoet / 12;
    let maandbedrag = 0;
    if (looptijd > 0 && teFinancierenNaSlotsom > 0) {
        maandbedrag = (teFinancierenNaSlotsom * maandelijkseRente) / (1 - Math.pow(1 + maandelijkseRente, -looptijd));
    }
    
    // Extra state voor operational lease
    const [kilometrage, setKilometrage] = useState(15000); // standaard 15.000 km/jaar
    const [servicekosten, setServicekosten] = useState(150); // standaard €150
    const marge = 1.08;
    const standaardKm = 15000;
    const kmCorrectie = 0.01; // 1% per 5.000 km
    const afschrijving = 0.20; // 20% per jaar
    const renteOpJaarbasis = 0.05; // 5% per jaar
    const maandRente = renteOpJaarbasis / 12;

    // Operational lease formule
    let maandbedragOperational = 0;
    if (leaseType === 'operational') {
        const A = selectedVoertuig?.fields.Prijs || 0;
        const p = afschrijving;
        const n = looptijd / 12;
        const k = kmCorrectie;
        const Kextra = Math.max(0, kilometrage - standaardKm);
        const L = looptijd;
        const i = maandRente;
        const S = servicekosten;
        const M = marge;
        // Restwaarde
        const restwaarde = A * Math.pow(1 - p, n) * (1 - k * (Kextra / 5000));
        // Afschrijving per maand
        const afschrijvingPerMaand = (A - restwaarde) / L;
        // Gemiddeld kapitaal
        const gemiddeldKapitaal = (A + restwaarde) / 2;
        // Rente per maand
        const rentePerMaand = i * gemiddeldKapitaal;
        // Totaal
        maandbedragOperational = (afschrijvingPerMaand + rentePerMaand + S) * M;
    }

    const handleSubmit = () => {
        if (!selectedVoertuig || selectedVoertuig.fields.Prijs === 0) {
            alert("Selecteer alstublieft een voertuig.");
            return;
        }
        onComplete({
            leaseType,
            selectedVoertuig: `${selectedVoertuig.fields.Merk} ${selectedVoertuig.fields.Model}`,
            aanbetaling,
            slotsom,
            looptijd,
            maandbedrag
        });
    };
    
    return (
        <div className="lease-form-container">
            <div className="step-header">
                <h2>Lease Configuratie</h2>
                <p className="step-description">Kies uw voertuig en lease type om te beginnen</p>
            </div>
            
            <div className="form-section">
                <label>Voertuig</label>
                 <select
                     value={selectedVoertuigId}
                     onChange={(e) => setSelectedVoertuigId(e.target.value)}
                     disabled={loading}
                     className="vehicle-select"
                 >
                     {voertuigen.map((voertuig) => (
                         <option key={voertuig.id} value={voertuig.id}>
                             {voertuig.fields.Merk} {voertuig.fields.Model} {voertuig.fields.Prijs > 0 ? `- ${formatCurrency(voertuig.fields.Prijs)}` : ''}
                         </option>
                     ))}
                 </select>
                 {loading && <p>Voertuigen laden...</p>}
                 {error && <p className="error-message">{error}</p>}
            </div>

            <div className="toggle-group">
                <button
                    className={leaseType === 'zakelijk' ? 'active' : ''}
                    onClick={() => setLeaseType('zakelijk')}
                >
                    Zakelijk
                </button>
                <button
                    className={leaseType === 'particulier' ? 'active' : ''}
                    onClick={() => setLeaseType('particulier')}
                >
                    Particulier
                </button>
                <button
                    className={leaseType === 'operational' ? 'active' : ''}
                    onClick={() => setLeaseType('operational')}
                >
                    Operational Lease
                </button>
            </div>
            
            {leaseType === 'particulier' ? (
                <PrivateLeaseForm 
                    selectedVoertuig={selectedVoertuig} 
                    onComplete={onComplete} 
                />
            ) : (
                <>
                    <div className="inputs-container">
                        <CurrencyInput label="Aanbetaling" value={aanbetaling} setValue={setAanbetaling} />
                        <div className="input-group">
                            <label>Slotsom <InfoTooltip text="De slotsom is het restbedrag aan het einde van het leasecontract. Je kunt dit bedrag aanpassen." /></label>
                            <div className="input-box">
                                €
                                <input
                                    type="number"
                                    value={slotsom}
                                    min={0}
                                    max={maxSlotsom}
                                    step={100}
                                    onChange={(e) => setSlotsom(Number(e.target.value))}
                                    style={{ background: 'white', color: '#333', cursor: 'text' }}
                                />
                            </div>
                        </div>
                        {leaseType === 'operational' && (
                            <>
                                <div className="input-group">
                                    <label>Kilometrage per jaar <InfoTooltip text="Aantal kilometers per jaar voor de lease." /></label>
                                    <div className="input-box">
                                        <input
                                            type="number"
                                            value={kilometrage}
                                            min={5000}
                                            step={1000}
                                            onChange={e => setKilometrage(Number(e.target.value))}
                                        />
                                        <span style={{marginLeft: 8}}>km</span>
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Servicekosten per maand <InfoTooltip text="Vast bedrag voor onderhoud, banden, verzekering etc." /></label>
                                    <div className="input-box">
                                        €
                                        <input
                                            type="number"
                                            value={servicekosten}
                                            min={0}
                                            step={10}
                                            onChange={e => setServicekosten(Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {leaseType === 'zakelijk' && (
                        <div className="info-box">
                            <p>Je betaalt <strong>{formatCurrency(btwBedrag)} BTW</strong> vooraf. De aanbetaling die je hier boven invoert komt daar extra bij. Het BTW bedrag vraag je terug bij de belastingdienst.</p>
                        </div>
                    )}
                    
                    <div className="form-section">
                        <label>Looptijd: <InfoTooltip text="Kies de gewenste duur van het leasecontract." /></label>
                        <div className="looptijd-radio-group">
                            {looptijden.map(l => {
                                let bedrag = 0;
                                if (leaseType === 'operational') {
                                    // Operational lease formule per looptijd
                                    const A = selectedVoertuig?.fields.Prijs || 0;
                                    const p = afschrijving;
                                    const n = l / 12;
                                    const k = kmCorrectie;
                                    const Kextra = Math.max(0, kilometrage - standaardKm);
                                    const L = l;
                                    const i = maandRente;
                                    const S = servicekosten;
                                    const M = marge;
                                    const restwaarde = A * Math.pow(1 - p, n) * (1 - k * (Kextra / 5000));
                                    const afschrijvingPerMaand = (A - restwaarde) / L;
                                    const gemiddeldKapitaal = (A + restwaarde) / 2;
                                    const rentePerMaand = i * gemiddeldKapitaal;
                                    bedrag = (afschrijvingPerMaand + rentePerMaand + S) * M;
                                } else if (l > 0 && teFinancierenNaSlotsom > 0) {
                                    bedrag = (teFinancierenNaSlotsom * maandelijkseRente) / (1 - Math.pow(1 + maandelijkseRente, -l));
                                }
                                const isMeestGekozen = (leaseType === 'zakelijk' && l === 60) || (leaseType === 'particulier' && l === 48);
                                return (
                                    <label key={l} className="looptijd-radio-row">
                                        <input
                                            type="radio"
                                            name="looptijd"
                                            value={l}
                                            checked={looptijd === l}
                                            onChange={() => setLooptijd(l)}
                                        />
                                        <span className="looptijd-radio-label">{l} maanden
                                            {isMeestGekozen && (
                                                <span className="looptijd-badge">meest gekozen</span>
                                            )}
                                        </span>
                                        <span className="looptijd-radio-bedrag">{formatCurrency(bedrag)}<span className="looptijd-radio-per">/maand</span></span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className="summary-card">
                        <h3>Overzicht</h3>
                        <div className="summary-main-amount">
                            {formatCurrency(leaseType === 'operational' ? maandbedragOperational : maandbedrag)}<span>/maand</span>
                        </div>
                        <div className="summary-details">
                            <div>
                                <span>Aanschafwaarde ({leaseType === 'zakelijk' ? 'ex' : 'incl'} BTW)</span>
                                <span>{formatCurrency(leaseType === 'zakelijk' ? aanschafwaardeExclBTW : aanschafwaardeInclBTW)}</span>
                            </div>
                            {leaseType === 'zakelijk' && (
                                 <div>
                                    <span>BTW</span>
                                    <span>{formatCurrency(btwBedrag)}</span>
                                </div>
                            )}
                            <div>
                                <span>Financiering</span>
                                <span>{formatCurrency(financiering)}</span>
                            </div>
                        </div>
                        {leaseType === 'operational' && (
                            <div style={{marginTop: '1em', fontSize: '0.95em', color: '#666'}}>
                                <strong>Berekening:</strong> Afschrijving + rente + servicekosten, verhoogd met marge. Restwaarde wordt berekend op basis van afschrijving en kilometrage.
                            </div>
                        )}
                    </div>

                    <div className="bottom-section">
                        <div className="marketing-banner">{randomMarketing}</div>
                        <div className="info-line">
                            <span className="check-icon"></span> Uitslag binnen: <strong>35 minuten</strong>
                        </div>
                        <button className="submit-button" onClick={handleSubmit}>
                            Volgende stap
                        </button>
                    </div>
                </>
            )}
        </div>
    );
} 