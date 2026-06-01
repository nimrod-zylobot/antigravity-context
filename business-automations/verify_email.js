async function resolveMxDoH(domain) {
    try {
        const url = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`;
        const res = await fetch(url);
        const data = await res.json();
        if (!data.Answer) {
            return [];
        }
        return data.Answer.map(ans => {
            const parts = ans.data.split(/\s+/);
            return {
                priority: parseInt(parts[0], 10),
                exchange: parts[1].replace(/\.$/, '')
            };
        });
    } catch (e) {
        console.error(`DoH resolution error for ${domain}:`, e.message);
        return [];
    }
}

async function verifyEmail(email) {
    // 1. Syntax check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return { valid: false, reason: 'Invalid email syntax format' };
    }

    const domain = email.split('@')[1];
    if (!domain) {
        return { valid: false, reason: 'Invalid email domain' };
    }

    // 2. DNS MX Record check (verifies if the domain is configured to receive emails)
    console.log(`Verifying MX records for domain: ${domain}...`);
    const mxRecords = await resolveMxDoH(domain);
    if (!mxRecords || mxRecords.length === 0) {
        return { valid: false, reason: 'Domain has no valid MX records (cannot receive mail)' };
    }

    console.log(`Found ${mxRecords.length} MX records. Lowest priority host: ${mxRecords[0].exchange}`);
    return { valid: true, reason: 'Format is valid and domain is configured to receive mail' };
}

// Quick command line runner
if (require.main === module) {
    const emailToTest = process.argv[2] || 'support@rtil.in';
    console.log(`Verifying email: ${emailToTest}`);
    verifyEmail(emailToTest)
        .then(res => console.log('\nResult:', res))
        .catch(console.error);
}

module.exports = { verifyEmail };
