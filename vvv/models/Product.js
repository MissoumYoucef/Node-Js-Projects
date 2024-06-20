const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min:0
    },
    description: {
        type: String,
        required: true
    },
    // category: {
    //     type: String,
    //     required: true
    // },
    sizes:[
        {
            type: String,
            enum: ['S', 'M', 'L', 'XL', 'XXL']
        }
    ],
    colors: [{
        type: String,
    }],
    stockQuantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0, 
    },
    
},{
    timestamps: true, // Adds createdAt and updatedAt fields
  });

module.exports = mongoose.model('Product', productSchema);