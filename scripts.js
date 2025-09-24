        document.addEventListener('DOMContentLoaded', () => {
            const wheelCanvas = document.getElementById('fortune-wheel');
            const spinButton = document.getElementById('spin-button');
            const resultDisplay = document.getElementById('result-display');
            const ctx = wheelCanvas.getContext('2d');

            // =================================================================
            // ===      ATUR DAFTAR HADIAH DENGAN SISTEM PELUANG (BOBOT)     ===
            // =================================================================
            // Bobot lebih tinggi = Peluang lebih besar
            const prizes = [
                { name: "Capcut Pro 1 Bulan", weight: 2 }, 
                { name: "Baca Qur`an",        weight: 2.2 },
                { name: "Canva Pro 1 Bulan",  weight: 3 }, 
                { name: "Sticker",            weight: 7 }, 
            ];
            // =================================================================

            const colors = ["#2980b9", "#c0392b", "#27ae60", "#f39c12", "#8e44ad", "#d35400", "#16a085", "#7f8c8d"];
            
            let currentRotation = 0;
            let finalAngle = 0; // Simpan sudut akhir untuk normalisasi
            let isSpinning = false;
            let winner = null; // Simpan pemenang yang telah ditentukan
            
            const segments = prizes.length;
            const segmentAngle = (2 * Math.PI) / segments;

            const drawWheel = () => {
                ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
                const radius = wheelCanvas.width / 2;
                
                prizes.forEach((prize, index) => {
                    const startAngle = index * segmentAngle;
                    ctx.beginPath();
                    ctx.fillStyle = colors[index % colors.length];
                    ctx.moveTo(radius, radius);
                    ctx.arc(radius, radius, radius - 5, startAngle, startAngle + segmentAngle);
                    ctx.closePath();
                    ctx.fill();

                    ctx.save();
                    ctx.fillStyle = "#fff";
                    ctx.font = 'bold 16px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    const textAngle = startAngle + segmentAngle / 2;
                    ctx.translate(
                        radius + Math.cos(textAngle) * (radius * 0.6),
                        radius + Math.sin(textAngle) * (radius * 0.6)
                    );
                    ctx.rotate(textAngle + Math.PI / 2);
                    ctx.fillText(prize.name, 0, 0); // Diubah untuk membaca properti 'name'
                    ctx.restore();
                });
            };
            
            const getWeightedWinner = () => {
                const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
                let randomWeight = Math.random() * totalWeight;

                for (let i = 0; i < prizes.length; i++) {
                    randomWeight -= prizes[i].weight;
                    if (randomWeight <= 0) {
                        return { winnerData: prizes[i], index: i };
                    }
                }
            };
            
            const startSpin = () => {
                if (isSpinning) return;
                
                isSpinning = true;
                spinButton.disabled = true;
                resultDisplay.textContent = "Berputar...";

                // 1. Tentukan pemenang berdasarkan bobot
                const { winnerData, index: winningIndex } = getWeightedWinner();
                winner = winnerData; // Simpan data pemenang
                
                // 2. Hitung sudut tujuan agar mendarat di segmen pemenang
                const segmentAngleDeg = 360 / segments;
                // Ambil sudut acak di dalam segmen pemenang (bukan di garis)
                const randomAngleInSegment = Math.random() * (segmentAngleDeg - 10) + 5;
                const targetPointerAngle = (winningIndex * segmentAngleDeg) + randomAngleInSegment;
                
                // 3. Hitung rotasi akhir roda
                // Pointer berada di atas, jadi kita putar roda kebalikan dari sudut target
                finalAngle = (360 - targetPointerAngle) % 360;

                // 4. Hasilkan durasi dan jumlah putaran secara acak
                const randomDuration = Math.random() * 4 + 5; // Durasi acak 5-9 detik
                const randomSpins = Math.floor(Math.random() * 10) + 5; // 5-14 putaran penuh
                const totalRotation = (randomSpins * 360) + finalAngle;
                
                // 5. Terapkan durasi dan rotasi ke roda
                wheelCanvas.style.transitionDuration = `${randomDuration}s`;
                wheelCanvas.style.transform = `rotate(${totalRotation}deg)`;
                currentRotation = totalRotation;
            };

            wheelCanvas.addEventListener('transitionend', () => {
                isSpinning = false;
                spinButton.disabled = false;

                resultDisplay.textContent = `${winner.name}!` + /n + 'Jangan Lupa Follow IG: @ukmi_ush';

                // Normalisasi sudut untuk putaran berikutnya agar lebih mulus
                const normalizedAngle = currentRotation % 360;
                wheelCanvas.style.transitionDuration = '0s';
                wheelCanvas.style.transform = `rotate(${normalizedAngle}deg)`;
                currentRotation = normalizedAngle;
            });

            spinButton.addEventListener('click', startSpin);
            
            // Tambahkan event listener untuk tombol spasi
            document.addEventListener('keydown', (e) => {
                if (e.code === 'Space' && !spinButton.disabled) {
                    spinButton.click();
                }
            });

            drawWheel();

        });
