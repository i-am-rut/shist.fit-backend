const maintainWeightEntries = async (userId) => {
    const entries = await WeightEntry.find({ user: userId }).sort({ date: 1 });
    if (entries.length < 2) return;

    const newEntries = [];

    for (let i = 0; i < entries.length - 1; i++) {
        const current = entries[i];
        const next = entries[i + 1];

        let dateCursor = new Date(current.date);
        const nextDate = new Date(next.date);

        dateCursor.setDate(dateCursor.getDate() + 1);

        while (dateCursor < nextDate) {
            const missingDate = new Date(dateCursor);

            const exists = await WeightEntry.exists({
                user: userId,
                date: missingDate
            });

            if (!exists) {
                newEntries.push({
                    user: userId,
                    weight: current.weight,
                    date: missingDate
                });
            }

            dateCursor.setDate(dateCursor.getDate() + 1);
        }
    }

    if (newEntries.length > 0) {
        await WeightEntry.insertMany(newEntries);
        console.log(`Added ${newEntries.length} missing weight entries for user ${userId}`);
    }
};

module.exports = maintainWeightEntries