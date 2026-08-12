import { useState, useMemo } from 'react';
import { Package, Plus, Edit, Trash2, Eye } from 'lucide-react';
import initialProducts from '../services/mockData';
import DataTable from '../components/common/DataTable';
import Button from '../components/common/Button';
import './AdminProductsPage.css';

export default function AdminProductsPage() {
  const [products, setProducts] = useState(initialProducts);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const columns = useMemo(() => [
    { 
      header: 'ID', 
      accessor: 'id',
      width: '10%' 
    },
    { 
      header: 'Product Name', 
      accessor: 'name',
      width: '30%',
      render: (row) => (
        <div className="admin-product-name-cell">
          <span className="font-medium">{row.name}</span>
          <span className="text-muted text-xs">{row.brand}</span>
        </div>
      )
    },
    { 
      header: 'Category', 
      accessor: 'category',
      width: '15%',
      render: (row) => (
        <span className="admin-category-badge">{row.category}</span>
      )
    },
    { 
      header: 'Price', 
      accessor: 'price',
      width: '15%',
      render: (row) => `$${row.price.toFixed(2)}`
    },
    { 
      header: 'Rating', 
      accessor: 'rating',
      width: '10%',
      render: (row) => (
        <div className="flex items-center gap-1">
          <span className="text-warning">★</span>
          <span>{row.rating}</span>
        </div>
      )
    },
    { 
      header: 'Actions', 
      accessor: 'actions',
      width: '20%',
      render: (row) => (
        <div className="admin-actions-cell">
          <button className="admin-action-btn view-btn" title="View">
            <Eye size={16} />
          </button>
          <button className="admin-action-btn edit-btn" title="Edit">
            <Edit size={16} />
          </button>
          <button 
            className="admin-action-btn delete-btn" 
            title="Delete"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ], []);

  return (
    <div className="admin-products-page page-enter">
      <div className="admin-products-header">
        <div>
          <h1 className="page-title">
            <Package size={28} className="title-icon text-accent" />
            Manage Products
          </h1>
          <p className="page-subtitle">View, edit, and manage catalog inventory.</p>
        </div>
        
        <Button variant="primary">
          <Plus size={18} />
          <span>Add New Product</span>
        </Button>
      </div>

      <div className="admin-products-content slide-up">
        <DataTable 
          columns={columns} 
          data={products} 
          searchable={true}
          searchPlaceholder="Search products by name, brand, or category..."
          itemsPerPage={10}
        />
      </div>
    </div>
  );
}
