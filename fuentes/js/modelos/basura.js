class Basura {
    constructor(id, nombre, color, peso, material, descripcion, estado, reciclable, fecha) {
        this.id = id || crypto.randomUUID();
        this.nombre = nombre;
        this.color = color;
        this.peso = parseFloat(peso) || 0;
        this.material = material;
        this.descripcion = descripcion;
        this.estado = estado;
        this.reciclable = reciclable === true || reciclable === 'on';
        this.fecha = fecha || new Date().toISOString().split('T')[0];
    }
}
