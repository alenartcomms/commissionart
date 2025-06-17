document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        items: [
            { id: 1, name: 'normal - headshot', img: '4 (2).jpg', price: 50000 },
            { id: 2, name: 'normal - bust up', img: '4.jpg', price: 60000 },
            { id: 3, name: 'normal - half body', img: '3.png', price: 80000 },
            { id: 4, name: 'chibi - head', img: '6.1_20250208110537.png', price: 25000 },
            { id: 5, name: 'chibi - halfbody', img: '5.png', price: 50000 },
            { id: 6, name: 'chibi - fullbody', img: '6.png', price: 70000 },
            { id: 7, name: 'idv - halfbody', img: 'uhh.png', price: 75000 },
            { id: 8, name: 'idv - fullbody', img: '8.png', price: 150000 },
        ],

    }));

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,
        add(newItem) {
            const cartItem = this.items.find((item) => item.id === newItem.id);

            if(!cartItem) {
            this.items.push({...newItem, quantity: 1, total: newItem.price });
            this.quantity++;
            this.total += newItem.price;
            } else {
                this.items = this.items.map((item) => {
                    if(item.id !== newItem.id) {
                        return item;
                    } else {
                        item.quantity++;
                        item.total = item.price * item.quantity;
                        this.quantity++;
                        this.total += item.price;
                        return item;
                    }
                });
            }
        },
        remove(id) {
            //ambil item yg akan diremove berdasarkan id
            const cartItem = this.items.find((item)=> item.id === id);
            //jika item lebih dari 1
            if(cartItem.quantity > 1) {
                //telusuri satu persatu
                this.items = this.items.map((item)=>{
                    //jika bukan item yang diklik
                    if(item.id !== id){
                        return item;
                    } else {
                        item.quantity--;
                        item.total = item.price * item.quantity;
                        this.quantity--;
                        this.total -= item.price;
                        return item;
                    }
                });
        } else if(cartItem.quantity === 1) {
            //jika item sisa 1
            this.items = this.items.filter((item)=> item.id !== id);
            this.quantity--;
            this.total -= cartItem.price;
        }
    },       
    });
});



//form validation
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function() {
    for(let i = 0; i < form.elements.length; i++) {
        if(form.elements[i].value.length !== 0) {
            checkoutButton.classList.remove('disabled');
            checkoutButton.classList.add('disabled');
        } else {
            return false;
        }
    }
    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');
});

//kirim data ketika tombol pay diklik
checkoutButton.addEventListener('click', async function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    const message = formatMessage(objData);
    window.open('http://wa.me/6283871537478?text=' + encodeURIComponent(message));



});


//kode untuk whatsapp
const formatMessage = (obj) => {
    return `Data Customer
    Nama : ${obj.name}
    Email : ${obj.email}
    No HP : ${obj.sosmed}
    
    Data Pesanan
    ${JSON.parse(obj.items).map((item)=> `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`)}
    Total: ${rupiah(obj.total)}
    Terima Kasih ya`;
}

// konversi ke rupiah
const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};
