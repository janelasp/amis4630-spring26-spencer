# Product Catalog Component Hierarchy

## Atoms
- **Button**: Triggers actions such as add to cart
- **Input**: For search and filter fields
- **Icon**: Visual cues
- **Label**: Product name, price, etc.
- **Image**: Product photos

## Molecules
- **ProductCard**: Combines Image, Label, Button, and Icon to display a product
- **SearchBar**: Combines Input and Button to search for products
- **FilterGroup**: Group of Inputs and Buttons for filtering
- **SortDropdown**: Group of Buttons to sort products
- **NavigationControls**: Navigation Buttons for pages
- **Title**: Icon and Button to display business name

## Organisms
- **ProductList**: Collection of ProductCard components and Navigation Controls
- **CatalogFilters**: Combines FilterGroup and SortDropdown
- **CatalogHeader**: Combines Title and Search Bar

## Templates
- **CatalogPageTemplate**: Layout for the catalog page, includes CatalogHeader, CatalogFilters, and ProductList


## Component Architecture Diagram

CatalogPageTemplate
└── CatalogHeader 
    └── SearchBar 
        ├── Input 
        └── Button
    └── Title 
        ├── Icon 
        └── Button  
└── CatalogFilters 
    └──FilterGroup 
        ├── Input 
        └── Button
    └── SortDropdown 
        └── Button  
└── ProductList 
    ├── ProductCard 
    │   ├── Image 
    │   ├── Label 
    │   └── Button 
    └── NavigationControls 


