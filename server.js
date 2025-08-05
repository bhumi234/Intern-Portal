const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Dummy data storage
const interns = [
    {
        id: '1',
        name: 'Alex Johnson',
        email: 'alex.johnson@company.com',
        referralCode: 'ALEX2025',
        totalDonations: 1250,
        joinDate: '2025-01-15',
        department: 'Engineering',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
        id: '2',
        name: 'Sarah Chen',
        email: 'sarah.chen@company.com',
        referralCode: 'SARAH2025',
        totalDonations: 2100,
        joinDate: '2025-01-10',
        department: 'Marketing',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
        id: '3',
        name: 'Mike Rodriguez',
        email: 'mike.rodriguez@company.com',
        referralCode: 'MIKE2025',
        totalDonations: 890,
        joinDate: '2025-01-20',
        department: 'Sales',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
        id: '4',
        name: 'Emily Davis',
        email: 'emily.davis@company.com',
        referralCode: 'EMILY2025',
        totalDonations: 1750,
        joinDate: '2025-01-12',
        department: 'Design',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
        id: '5',
        name: 'David Kim',
        email: 'david.kim@company.com',
        referralCode: 'DAVID2025',
        totalDonations: 3200,
        joinDate: '2025-01-08',
        department: 'Engineering',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    }
];

const rewards = [
    {
        id: '1',
        name: 'Coffee with CEO',
        description: '30-minute coffee chat with the CEO',
        pointsRequired: 1000,
        unlocked: true,
        icon: '☕'
    },
    {
        id: '2',
        name: 'Flexible Hours',
        description: 'Work from home 2 days per week',
        pointsRequired: 2000,
        unlocked: true,
        icon: '🏠'
    },
    {
        id: '3',
        name: 'Conference Pass',
        description: 'Attend industry conference of your choice',
        pointsRequired: 3000,
        unlocked: false,
        icon: '🎫'
    },
    {
        id: '4',
        name: 'Mentorship Program',
        description: '1-on-1 mentorship with senior leader',
        pointsRequired: 4000,
        unlocked: false,
        icon: '👥'
    },
    {
        id: '5',
        name: 'Bonus Day Off',
        description: 'Extra paid day off',
        pointsRequired: 5000,
        unlocked: false,
        icon: '🎉'
    }
];

const leaderboard = [
    { name: 'David Kim', donations: 3200, referrals: 8, department: 'Engineering' },
    { name: 'Sarah Chen', donations: 2100, referrals: 6, department: 'Marketing' },
    { name: 'Emily Davis', donations: 1750, referrals: 5, department: 'Design' },
    { name: 'Alex Johnson', donations: 1250, referrals: 4, department: 'Engineering' },
    { name: 'Mike Rodriguez', donations: 890, referrals: 3, department: 'Sales' },
    { name: 'Lisa Wang', donations: 750, referrals: 2, department: 'HR' },
    { name: 'Tom Wilson', donations: 650, referrals: 2, department: 'Finance' },
    { name: 'Anna Brown', donations: 520, referrals: 1, department: 'Operations' }
];

// Routes
app.get('/', (req, res) => {
    res.render('login', { title: 'Intern Portal - Login' });
});

app.get('/dashboard', (req, res) => {
    // Default to first intern for demo
    const currentIntern = interns[0];
    res.render('dashboard', { 
        title: 'Intern Dashboard',
        intern: currentIntern,
        rewards: rewards,
        recentActivity: [
            { type: 'donation', amount: 150, date: '2025-01-27', description: 'Monthly donation' },
            { type: 'referral', amount: 0, date: '2025-01-26', description: 'Referred Sarah Chen' },
            { type: 'reward', amount: 0, date: '2025-01-25', description: 'Unlocked Coffee with CEO' }
        ]
    });
});

app.get('/leaderboard', (req, res) => {
    res.render('leaderboard', { 
        title: 'Leaderboard',
        leaderboard: leaderboard
    });
});

// API Routes
app.get('/api/interns', (req, res) => {
    res.json({ success: true, data: interns });
});

app.get('/api/interns/:id', (req, res) => {
    const intern = interns.find(i => i.id === req.params.id);
    if (intern) {
        res.json({ success: true, data: intern });
    } else {
        res.status(404).json({ success: false, error: 'Intern not found' });
    }
});

app.get('/api/rewards', (req, res) => {
    res.json({ success: true, data: rewards });
});

app.get('/api/leaderboard', (req, res) => {
    res.json({ success: true, data: leaderboard });
});

app.post('/api/donations', (req, res) => {
    const { internId, amount } = req.body;
    const intern = interns.find(i => i.id === internId);
    
    if (intern) {
        intern.totalDonations += parseInt(amount);
        res.json({ 
            success: true, 
            message: 'Donation recorded successfully',
            newTotal: intern.totalDonations
        });
    } else {
        res.status(404).json({ success: false, error: 'Intern not found' });
    }
});

app.get('/api/stats', (req, res) => {
    const totalDonations = interns.reduce((sum, intern) => sum + intern.totalDonations, 0);
    const totalInterns = interns.length;
    const avgDonations = Math.round(totalDonations / totalInterns);
    
    res.json({
        success: true,
        data: {
            totalDonations,
            totalInterns,
            avgDonations,
            topPerformer: leaderboard[0]
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Intern Portal server running on http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`🏆 Leaderboard: http://localhost:${PORT}/leaderboard`);
}); 