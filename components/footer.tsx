import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">CUBE</h3>
            <p className="text-muted-foreground">
              Votre restaurant moderne à portée de main. Commandez en ligne et faites-vous livrer.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-muted-foreground hover:text-primary">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/personnaliser" className="text-muted-foreground hover:text-primary">
                  Personnaliser
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>+241 XXX XXX XXX</li>
              <li>contact@cube.com</li>
              <li>Libreville, Gabon</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Horaires</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Lun - Ven: 10h - 21h</li>
              <li>Sam - Dim: 11h - 20h</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-muted-foreground/20 mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 CUBE. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
